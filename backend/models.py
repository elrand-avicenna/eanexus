from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AffinityLevel(str, Enum):
    STRANGER = "stranger"
    ACQUAINTANCE = "acquaintance"
    FRIEND = "friend"
    CLOSE_FRIEND = "close_friend"
    BEST_FRIEND = "best_friend"

class NPCPersonality(str, Enum):
    FRIENDLY = "friendly"
    SHY = "shy"
    SARCASTIC = "sarcastic"
    SERIOUS = "serious"
    CHEERFUL = "cheerful"
    MYSTERIOUS = "mysterious"
    PRAGMATIC = "pragmatic"
    CURIOUS = "curious"

class RoomStatus(str, Enum):
    LOCKED = "locked"
    UNLOCKED = "unlocked"
    COMPLETED = "completed"

class ItemRarity(str, Enum):
    COMMON = "common"
    UNCOMMON = "uncommon"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"

# User Models
class User(BaseModel):
    id: str
    username: str
    current_floor: int = 0
    current_room: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_active: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    username: str

# NPC Models
class NPC(BaseModel):
    id: str
    name: str
    personality: NPCPersonality
    bio: str  # Revealed progressively through conversations
    avatar: str  # Base64 image
    current_floor: int
    current_room: int
    conversation_style: str  # Description for AI
    revealed_info: List[str] = []  # Info revealed to user
    schedule: Dict[str, Any] = {}  # Time-based positioning

class NPCCreate(BaseModel):
    name: str
    personality: NPCPersonality
    bio: str
    avatar: str
    current_floor: int = 0
    current_room: int = 0
    conversation_style: str = ""

class NPCUpdate(BaseModel):
    current_floor: Optional[int] = None
    current_room: Optional[int] = None
    revealed_info: Optional[List[str]] = None

# Affinity Models
class Affinity(BaseModel):
    id: str
    user_id: str
    npc_id: str
    level: AffinityLevel = AffinityLevel.STRANGER
    points: int = 0  # 0-100
    is_friend: bool = False
    messages_count: int = 0
    last_interaction: datetime = Field(default_factory=datetime.utcnow)

class AffinityUpdate(BaseModel):
    points_change: int
    is_friend: Optional[bool] = None

# Message Models
class Message(BaseModel):
    id: str
    user_id: str
    npc_id: str
    sender: str  # 'user' or 'npc'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    affinity_change: int = 0

class MessageCreate(BaseModel):
    npc_id: str
    content: str

class MessageResponse(BaseModel):
    message: Message
    npc_reply: Message
    affinity_change: int
    affinity_level: AffinityLevel

# Item Models
class Item(BaseModel):
    id: str
    name: str
    description: str
    rarity: ItemRarity
    icon: str  # Base64 or emoji
    properties: Dict[str, Any] = {}  # Custom properties
    fusible: bool = True

class ItemCreate(BaseModel):
    name: str
    description: str
    rarity: ItemRarity
    icon: str
    properties: Dict[str, Any] = {}

# Inventory Models
class InventoryItem(BaseModel):
    id: str
    user_id: str
    item_id: str
    quantity: int = 1
    obtained_at: datetime = Field(default_factory=datetime.utcnow)

class InventoryResponse(BaseModel):
    item: Item
    quantity: int
    obtained_at: datetime

# Fusion Models
class FusionRecipe(BaseModel):
    id: str
    required_items: List[str]  # List of item IDs
    result_item_id: str
    success_rate: float = 1.0  # 0.0 to 1.0

class FusionRequest(BaseModel):
    item_ids: List[str]  # Minimum 2 items

class FusionResult(BaseModel):
    success: bool
    result_item: Optional[Item] = None
    message: str

# Room/Floor Models
class Room(BaseModel):
    id: str
    floor: int
    room_number: int  # 0-9 (10 rooms per floor)
    title: str
    description: str
    enigma: str  # The puzzle description
    solution: str  # The solution (hidden from user)
    hints: List[str] = []
    required_items: List[str] = []  # Item IDs needed
    rewards: List[str] = []  # Item IDs rewarded
    status: RoomStatus = RoomStatus.LOCKED

class RoomCreate(BaseModel):
    floor: int
    room_number: int
    title: str
    description: str
    enigma: str
    solution: str
    hints: List[str] = []
    required_items: List[str] = []
    rewards: List[str] = []

class RoomAttempt(BaseModel):
    user_answer: str

class RoomAttemptResponse(BaseModel):
    success: bool
    message: str
    rewards: List[Item] = []
    next_room_unlocked: bool = False

# Quest Models
class Quest(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    type: str  # 'main', 'side', 'npc'
    requirements: Dict[str, Any] = {}
    rewards: List[str] = []  # Item IDs
    completed: bool = False
    progress: int = 0  # 0-100
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuestCreate(BaseModel):
    title: str
    description: str
    type: str
    requirements: Dict[str, Any] = {}
    rewards: List[str] = []

# Game Universe Config
class GameConfig(BaseModel):
    universe_description: str
    tower_rules: List[str]
    year: int = 2316
    total_floors_up: int = 100
    total_floors_down: int = 100
    rooms_per_floor: int = 10
