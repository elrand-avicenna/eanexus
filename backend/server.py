from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import uuid

# Import models and services
from models import (
    User, UserCreate, NPC, NPCCreate, NPCUpdate,
    Affinity, AffinityUpdate, AffinityLevel,
    Message, MessageCreate, MessageResponse,
    Item, ItemCreate, InventoryItem, InventoryResponse,
    FusionRequest, FusionResult,
    Room, RoomCreate, RoomAttempt, RoomAttemptResponse, RoomStatus,
    Quest, QuestCreate
)
from game_universe import NPC_PROFILES, UNIVERSE_CONFIG, get_npc_position
from ai_service import ai_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== USER ENDPOINTS ====================

@api_router.post("/user/create", response_model=User)
async def create_user(user_input: UserCreate):
    """Créer un nouvel utilisateur"""
    user_id = str(uuid.uuid4())
    user = User(id=user_id, username=user_input.username)
    
    await db.users.insert_one(user.dict())
    
    # Initialize affinity with all NPCs
    for npc_profile in NPC_PROFILES:
        affinity = Affinity(
            id=str(uuid.uuid4()),
            user_id=user_id,
            npc_id=npc_profile["name"],  # Using name as ID for simplicity
            level=AffinityLevel.STRANGER,
            points=0,
            is_friend=False
        )
        await db.affinities.insert_one(affinity.dict())
    
    return user

@api_router.get("/user/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Récupérer un utilisateur"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@api_router.put("/user/{user_id}/position")
async def update_user_position(user_id: str, floor: int, room: int):
    """Mettre à jour la position de l'utilisateur"""
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"current_floor": floor, "current_room": room, "last_active": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "floor": floor, "room": room}

# ==================== NPC ENDPOINTS ====================

@api_router.get("/npcs", response_model=List[dict])
async def get_all_npcs():
    """Récupérer tous les NPCs avec leurs positions actuelles"""
    npcs_with_positions = []
    
    for npc_profile in NPC_PROFILES:
        floor, room = get_npc_position(npc_profile.get("schedule", {}))
        npc_data = {
            "id": npc_profile["name"],
            "name": npc_profile["name"],
            "personality": npc_profile["personality"],
            "current_floor": floor,
            "current_room": room,
            "bio": "",  # Hidden until revealed
            "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={npc_profile['name']}",
            "revealed_info": []
        }
        npcs_with_positions.append(npc_data)
    
    return npcs_with_positions

@api_router.get("/npcs/{npc_id}")
async def get_npc(npc_id: str, user_id: str):
    """Récupérer un NPC avec les infos dévoilées pour cet utilisateur"""
    npc_profile = next((npc for npc in NPC_PROFILES if npc["name"] == npc_id), None)
    if not npc_profile:
        raise HTTPException(status_code=404, detail="NPC not found")
    
    # Get affinity to determine revealed info
    affinity = await db.affinities.find_one({"user_id": user_id, "npc_id": npc_id})
    if not affinity:
        raise HTTPException(status_code=404, detail="Affinity not found")
    
    affinity_obj = Affinity(**affinity)
    floor, room = get_npc_position(npc_profile.get("schedule", {}))
    
    # Determine what to reveal based on affinity
    revealed_info = []
    if affinity_obj.level in [AffinityLevel.FRIEND, AffinityLevel.CLOSE_FRIEND, AffinityLevel.BEST_FRIEND]:
        revealed_info = npc_profile.get("secrets", [])[:1]
    if affinity_obj.level in [AffinityLevel.CLOSE_FRIEND, AffinityLevel.BEST_FRIEND]:
        revealed_info = npc_profile.get("secrets", [])[:2]
    if affinity_obj.level == AffinityLevel.BEST_FRIEND:
        revealed_info = npc_profile.get("secrets", [])
    
    return {
        "id": npc_profile["name"],
        "name": npc_profile["name"],
        "personality": npc_profile["personality"],
        "bio": npc_profile["bio"] if affinity_obj.level != AffinityLevel.STRANGER else "",
        "current_floor": floor,
        "current_room": room,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={npc_profile['name']}",
        "revealed_info": revealed_info,
        "conversation_style": npc_profile["conversation_style"]
    }

# ==================== AFFINITY ENDPOINTS ====================

@api_router.get("/affinity/{user_id}/{npc_id}", response_model=Affinity)
async def get_affinity(user_id: str, npc_id: str):
    """Récupérer l'affinité entre un utilisateur et un NPC"""
    affinity = await db.affinities.find_one({"user_id": user_id, "npc_id": npc_id})
    if not affinity:
        raise HTTPException(status_code=404, detail="Affinity not found")
    return Affinity(**affinity)

@api_router.get("/affinity/{user_id}", response_model=List[Affinity])
async def get_all_affinities(user_id: str):
    """Récupérer toutes les affinités d'un utilisateur"""
    affinities = await db.affinities.find({"user_id": user_id}).to_list(100)
    return [Affinity(**a) for a in affinities]

@api_router.post("/affinity/{user_id}/{npc_id}/friend")
async def add_friend(user_id: str, npc_id: str):
    """Ajouter un NPC comme ami"""
    result = await db.affinities.update_one(
        {"user_id": user_id, "npc_id": npc_id},
        {"$set": {"is_friend": True, "last_interaction": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Affinity not found")
    return {"success": True, "message": f"{npc_id} est maintenant votre ami!"}

# ==================== MESSENGER ENDPOINTS ====================

@api_router.post("/messages/send", response_model=MessageResponse)
async def send_message(user_id: str, message_input: MessageCreate):
    """Envoyer un message à un NPC et recevoir une réponse"""
    
    # Check if they are friends
    affinity = await db.affinities.find_one({"user_id": user_id, "npc_id": message_input.npc_id})
    if not affinity:
        raise HTTPException(status_code=404, detail="Affinity not found")
    
    affinity_obj = Affinity(**affinity)
    if not affinity_obj.is_friend:
        raise HTTPException(status_code=403, detail="You must be friends to send messages")
    
    # Get user data
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_obj = User(**user)
    
    # Get NPC data
    npc_profile = next((npc for npc in NPC_PROFILES if npc["name"] == message_input.npc_id), None)
    if not npc_profile:
        raise HTTPException(status_code=404, detail="NPC not found")
    
    floor, room = get_npc_position(npc_profile.get("schedule", {}))
    npc_data = {
        **npc_profile,
        "current_floor": floor,
        "current_room": room,
        "revealed_info": []
    }
    
    # Calculate affinity change
    affinity_change = ai_service.calculate_affinity_change(
        message_input.content,
        npc_profile["personality"]
    )
    
    # Create user message
    user_message = Message(
        id=str(uuid.uuid4()),
        user_id=user_id,
        npc_id=message_input.npc_id,
        sender="user",
        content=message_input.content,
        affinity_change=affinity_change
    )
    await db.messages.insert_one(user_message.dict())
    
    # Get conversation history
    history = await db.messages.find({
        "user_id": user_id,
        "npc_id": message_input.npc_id
    }).sort("timestamp", -1).limit(10).to_list(10)
    
    conversation_history = [
        {"role": "user" if msg["sender"] == "user" else "assistant", "content": msg["content"]}
        for msg in reversed(history)
    ]
    
    # Generate NPC response
    npc_response_text = await ai_service.generate_npc_response(
        npc_data,
        message_input.content,
        conversation_history,
        affinity_obj.level,
        affinity_obj.points,
        user_obj.current_floor,
        user_obj.current_room
    )
    
    # Create NPC message
    npc_message = Message(
        id=str(uuid.uuid4()),
        user_id=user_id,
        npc_id=message_input.npc_id,
        sender="npc",
        content=npc_response_text,
        affinity_change=0
    )
    await db.messages.insert_one(npc_message.dict())
    
    # Update affinity
    new_points = min(100, max(0, affinity_obj.points + affinity_change))
    new_level = _calculate_affinity_level(new_points)
    
    await db.affinities.update_one(
        {"user_id": user_id, "npc_id": message_input.npc_id},
        {
            "$set": {
                "points": new_points,
                "level": new_level.value,
                "last_interaction": datetime.utcnow()
            },
            "$inc": {"messages_count": 1}
        }
    )
    
    return MessageResponse(
        message=user_message,
        npc_reply=npc_message,
        affinity_change=affinity_change,
        affinity_level=new_level
    )

@api_router.get("/messages/{user_id}/{npc_id}", response_model=List[Message])
async def get_messages(user_id: str, npc_id: str, limit: int = 50):
    """Récupérer l'historique des messages avec un NPC"""
    messages = await db.messages.find({
        "user_id": user_id,
        "npc_id": npc_id
    }).sort("timestamp", -1).limit(limit).to_list(limit)
    
    return [Message(**msg) for msg in reversed(messages)]

# ==================== INVENTORY ENDPOINTS ====================

@api_router.get("/inventory/{user_id}", response_model=List[InventoryResponse])
async def get_inventory(user_id: str):
    """Récupérer l'inventaire d'un utilisateur"""
    inventory_items = await db.inventory.find({"user_id": user_id}).to_list(1000)
    
    response = []
    for inv_item in inventory_items:
        item = await db.items.find_one({"id": inv_item["item_id"]})
        if item:
            response.append(InventoryResponse(
                item=Item(**item),
                quantity=inv_item["quantity"],
                obtained_at=inv_item["obtained_at"]
            ))
    
    return response

@api_router.post("/inventory/{user_id}/add")
async def add_to_inventory(user_id: str, item_id: str, quantity: int = 1):
    """Ajouter un objet à l'inventaire"""
    existing = await db.inventory.find_one({"user_id": user_id, "item_id": item_id})
    
    if existing:
        await db.inventory.update_one(
            {"user_id": user_id, "item_id": item_id},
            {"$inc": {"quantity": quantity}}
        )
    else:
        inv_item = InventoryItem(
            id=str(uuid.uuid4()),
            user_id=user_id,
            item_id=item_id,
            quantity=quantity
        )
        await db.inventory.insert_one(inv_item.dict())
    
    return {"success": True, "message": f"Added {quantity}x item to inventory"}

# ==================== FUSION ENDPOINTS ====================

@api_router.post("/fusion/{user_id}", response_model=FusionResult)
async def fuse_items(user_id: str, fusion_request: FusionRequest):
    """Fusionner des objets (Hourglass Eye)"""
    if len(fusion_request.item_ids) < 2:
        raise HTTPException(status_code=400, detail="Minimum 2 items required for fusion")
    
    # For MVP: Simple random fusion result
    # Check if user has all items
    for item_id in fusion_request.item_ids:
        inv_item = await db.inventory.find_one({"user_id": user_id, "item_id": item_id})
        if not inv_item or inv_item["quantity"] < 1:
            raise HTTPException(status_code=400, detail=f"Item {item_id} not found in inventory")
    
    # Remove items from inventory
    for item_id in fusion_request.item_ids:
        await db.inventory.update_one(
            {"user_id": user_id, "item_id": item_id},
            {"$inc": {"quantity": -1}}
        )
    
    # Create a random result item (for MVP)
    new_item = Item(
        id=str(uuid.uuid4()),
        name="Objet Fusionné",
        description="Un objet créé par fusion",
        rarity="rare",
        icon="✨",
        fusible=True
    )
    await db.items.insert_one(new_item.dict())
    
    # Add to inventory
    await add_to_inventory(user_id, new_item.id, 1)
    
    return FusionResult(
        success=True,
        result_item=new_item,
        message="Fusion réussie!"
    )

# ==================== ROOM/FLOOR ENDPOINTS ====================

@api_router.get("/rooms/floor/{floor}", response_model=List[Room])
async def get_rooms_by_floor(floor: int):
    """Récupérer toutes les salles d'un étage"""
    rooms = await db.rooms.find({"floor": floor}).to_list(10)
    return [Room(**room) for room in rooms]

@api_router.get("/rooms/{floor}/{room_number}", response_model=Room)
async def get_room(floor: int, room_number: int):
    """Récupérer une salle spécifique"""
    room = await db.rooms.find_one({"floor": floor, "room_number": room_number})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return Room(**room)

@api_router.post("/rooms/{floor}/{room_number}/attempt", response_model=RoomAttemptResponse)
async def attempt_room(floor: int, room_number: int, user_id: str, attempt: RoomAttempt):
    """Tenter de résoudre une énigme de salle"""
    room = await db.rooms.find_one({"floor": floor, "room_number": room_number})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    room_obj = Room(**room)
    
    # Check if answer is correct (case-insensitive)
    is_correct = attempt.user_answer.lower().strip() == room_obj.solution.lower().strip()
    
    if is_correct:
        # Mark room as completed
        await db.rooms.update_one(
            {"floor": floor, "room_number": room_number},
            {"$set": {"status": RoomStatus.COMPLETED.value}}
        )
        
        # Unlock next room
        next_room_number = room_number + 1
        if next_room_number < 10:
            await db.rooms.update_one(
                {"floor": floor, "room_number": next_room_number},
                {"$set": {"status": RoomStatus.UNLOCKED.value}}
            )
            next_unlocked = True
        else:
            next_unlocked = False
        
        # Give rewards
        reward_items = []
        for reward_id in room_obj.rewards:
            item = await db.items.find_one({"id": reward_id})
            if item:
                reward_items.append(Item(**item))
                await add_to_inventory(user_id, reward_id, 1)
        
        return RoomAttemptResponse(
            success=True,
            message="Énigme résolue!",
            rewards=reward_items,
            next_room_unlocked=next_unlocked
        )
    else:
        return RoomAttemptResponse(
            success=False,
            message="Réponse incorrecte. Essayez encore!",
            rewards=[],
            next_room_unlocked=False
        )

# ==================== QUEST ENDPOINTS ====================

@api_router.get("/quests/{user_id}", response_model=List[Quest])
async def get_quests(user_id: str):
    """Récupérer toutes les quêtes d'un utilisateur"""
    quests = await db.quests.find({"user_id": user_id}).to_list(100)
    return [Quest(**quest) for quest in quests]

@api_router.post("/quests/{user_id}/create", response_model=Quest)
async def create_quest(user_id: str, quest_input: QuestCreate):
    """Créer une nouvelle quête"""
    quest = Quest(
        id=str(uuid.uuid4()),
        user_id=user_id,
        **quest_input.dict()
    )
    await db.quests.insert_one(quest.dict())
    return quest

# ==================== INITIALIZATION ENDPOINT ====================

@api_router.post("/init/game")
async def initialize_game():
    """Initialiser le jeu avec les données de base (premier étage, objets de base)"""
    
    # Create base items
    base_items = [
        {"id": "key1", "name": "Clé Rouillée", "description": "Une vieille clé", "rarity": "common", "icon": "🔑", "fusible": True},
        {"id": "torch", "name": "Torche", "description": "Éclaire les zones sombres", "rarity": "common", "icon": "🔦", "fusible": True},
        {"id": "crystal", "name": "Cristal", "description": "Un cristal mystérieux", "rarity": "uncommon", "icon": "💎", "fusible": True},
        {"id": "potion", "name": "Potion de Soin", "description": "Restaure la santé", "rarity": "common", "icon": "⚕️", "fusible": False},
    ]
    
    for item_data in base_items:
        existing = await db.items.find_one({"id": item_data["id"]})
        if not existing:
            await db.items.insert_one(item_data)
    
    # Create first floor rooms (generic puzzles for MVP)
    generic_rooms = [
        {
            "room_number": 0,
            "title": "Salle d'Entrée",
            "description": "Une salle simple avec un panneau au mur.",
            "enigma": "Sur le panneau: 'Je suis le début de tout, la fin de nulle part. Qui suis-je?'",
            "solution": "lettre n",
            "hints": ["Pensez aux lettres", "Début et fin..."],
            "required_items": [],
            "rewards": ["torch"],
            "status": RoomStatus.UNLOCKED.value
        },
        {
            "room_number": 1,
            "title": "Couloir Sombre",
            "description": "Un couloir sans lumière.",
            "enigma": "Il fait trop sombre pour voir. Vous avez besoin de lumière.",
            "solution": "torche",
            "hints": ["Cherchez dans votre inventaire"],
            "required_items": ["torch"],
            "rewards": ["key1"],
            "status": RoomStatus.LOCKED.value
        },
        {
            "room_number": 2,
            "title": "Porte Verrouillée",
            "description": "Une porte massive avec une serrure.",
            "enigma": "La porte est verrouillée. Il vous faut une clé.",
            "solution": "clé",
            "hints": ["La clé est derrière vous..."],
            "required_items": ["key1"],
            "rewards": ["crystal"],
            "status": RoomStatus.LOCKED.value
        },
        {
            "room_number": 3,
            "title": "Salle des Miroirs",
            "description": "Des miroirs partout.",
            "enigma": "Quel est le seul objet qui se brise en prononçant son nom?",
            "solution": "silence",
            "hints": ["Pensez au son", "Quand vous parlez..."],
            "required_items": [],
            "rewards": ["potion"],
            "status": RoomStatus.LOCKED.value
        },
        {
            "room_number": 4,
            "title": "Bibliothèque",
            "description": "Des livres anciens partout.",
            "enigma": "Je suis toujours devant toi mais tu ne peux jamais me rattraper. Qui suis-je?",
            "solution": "avenir",
            "hints": ["Le temps...", "Demain..."],
            "required_items": [],
            "rewards": ["crystal"],
            "status": RoomStatus.LOCKED.value
        },
        {
            "room_number": 5,
            "title": "Laboratoire",
            "description": "Un laboratoire abandonné.",
            "enigma": "Combien font 2 + 2 en binaire?",
            "solution": "100",
            "hints": ["Base 2", "1+1=10 en binaire"],
            "required_items": [],
            "rewards": ["potion"],
            "status": RoomStatus.LOCKED.value
        },
        {
            "room_number": 6,
            "title": "Jardin Intérieur",
            "description": "Un petit jardin avec des plantes étranges.",
            "enigma": "Plus tu m'enlèves, plus je deviens grand. Qui suis-je?",
            "solution": "trou",
            "hints": ["Creuser..."],
            "required_items": [],
            "rewards": ["crystal"],
            "status": RoomStatus.LOCKED.value
        },
        {
            "room_number": 7,
            "title": "Atelier",
            "description": "Un atelier avec des outils.",
            "enigma": "J'ai des clés mais pas de serrures. J'ai de l'espace mais pas de pièces. Tu peux entrer mais pas sortir. Qui suis-je?",
            "solution": "clavier",
            "hints": ["Ordinateur", "Touches..."],
            "required_items": [],
            "rewards": ["torch"],
            "status": RoomStatus.LOCKED.value
        },
        {
            "room_number": 8,
            "title": "Chambre Secrète",
            "description": "Une chambre cachée.",
            "enigma": "Qu'est-ce qui a 4 jambes le matin, 2 à midi et 3 le soir?",
            "solution": "homme",
            "hints": ["Énigme du Sphinx", "Les âges de la vie"],
            "required_items": [],
            "rewards": ["key1"],
            "status": RoomStatus.LOCKED.value
        },
        {
            "room_number": 9,
            "title": "Sortie",
            "description": "La sortie de l'étage!",
            "enigma": "Dernier défi: Quel est le mot de passe? Indice: Le début de tout dans cette tour.",
            "solution": "survie",
            "hints": ["Pensez au nom de l'expérience", "Tour de..."],
            "required_items": [],
            "rewards": ["crystal", "potion"],
            "status": RoomStatus.LOCKED.value
        }
    ]
    
    for room_data in generic_rooms:
        existing = await db.rooms.find_one({"floor": 0, "room_number": room_data["room_number"]})
        if not existing:
            room = Room(
                id=str(uuid.uuid4()),
                floor=0,
                **room_data
            )
            await db.rooms.insert_one(room.dict())
    
    return {"success": True, "message": "Game initialized with floor 0 and base items"}

# ==================== HELPER FUNCTIONS ====================

def _calculate_affinity_level(points: int) -> AffinityLevel:
    """Calculer le niveau d'affinité basé sur les points"""
    if points >= 81:
        return AffinityLevel.BEST_FRIEND
    elif points >= 61:
        return AffinityLevel.CLOSE_FRIEND
    elif points >= 41:
        return AffinityLevel.FRIEND
    elif points >= 21:
        return AffinityLevel.ACQUAINTANCE
    else:
        return AffinityLevel.STRANGER

# ==================== MAIN ROUTES ====================

@api_router.get("/")
async def root():
    return {
        "message": "Tour de Survie 2316 - API",
        "year": 2316,
        "version": "1.0.0"
    }

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
