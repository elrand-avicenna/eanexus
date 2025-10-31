import os
from typing import List, Dict, Any
from datetime import datetime
from game_universe import BASE_SYSTEM_PROMPT, UNIVERSE_CONFIG, get_time_period
from models import AffinityLevel
import random

# Mode mock par défaut pour éviter les coûts pendant le développement
USE_MOCK_AI = os.getenv("USE_MOCK_AI", "true").lower() == "true"

class AIService:
    def __init__(self):
        self.use_mock = USE_MOCK_AI
        if not self.use_mock:
            # Import real AI only when needed
            try:
                # Gemini import will be added when user is ready
                pass
            except ImportError:
                print("⚠️ AI libraries not found, falling back to mock mode")
                self.use_mock = True
    
    async def generate_npc_response(
        self,
        npc_data: Dict[str, Any],
        user_message: str,
        conversation_history: List[Dict[str, str]],
        affinity_level: AffinityLevel,
        affinity_points: int,
        user_floor: int,
        user_room: int
    ) -> str:
        """Génère une réponse du NPC basée sur le contexte"""
        
        if self.use_mock:
            return self._generate_mock_response(
                npc_data,
                user_message,
                affinity_level,
                affinity_points
            )
        else:
            return await self._generate_real_ai_response(
                npc_data,
                user_message,
                conversation_history,
                affinity_level,
                affinity_points,
                user_floor,
                user_room
            )
    
    def _generate_mock_response(
        self,
        npc_data: Dict[str, Any],
        user_message: str,
        affinity_level: AffinityLevel,
        affinity_points: int
    ) -> str:
        """Génère une réponse mock basée sur la personnalité et l'affinité"""
        
        name = npc_data.get("name", "NPC")
        personality = npc_data.get("personality", "friendly")
        
        # Réponses basées sur l'affinité
        if affinity_level == AffinityLevel.STRANGER:
            responses = [
                f"Qui êtes-vous ? Je ne vous connais pas.",
                f"Désolé, je ne parle pas aux inconnus.",
                f"Vous avez besoin de quelque chose ? Faites vite.",
                f"..."
            ]
        elif affinity_level == AffinityLevel.ACQUAINTANCE:
            responses = [
                f"Ah, c'est vous. Que voulez-vous ?",
                f"Je commence à reconnaître votre nom.",
                f"D'accord, je vous écoute.",
                f"Vous êtes de retour..."
            ]
        elif affinity_level == AffinityLevel.FRIEND:
            responses = [
                f"Hey ! Content de vous voir !",
                f"Alors, quoi de neuf dans votre tour ?",
                f"Vous avez besoin d'aide avec quelque chose ?",
                f"J'ai justement pensé à vous."
            ]
        elif affinity_level == AffinityLevel.CLOSE_FRIEND:
            responses = [
                f"Mon ami ! Racontez-moi tout !",
                f"Je suis toujours là pour vous aider.",
                f"Vous savez que vous pouvez compter sur moi.",
                f"J'ai découvert quelque chose d'intéressant aujourd'hui..."
            ]
        else:  # BEST_FRIEND
            responses = [
                f"Hey toi ! Tu me manquais !",
                f"J'ai un secret à te confier...",
                f"On forme une sacrée équipe tous les deux.",
                f"Je te fais entièrement confiance maintenant."
            ]
        
        # Adapter selon la personnalité
        response = random.choice(responses)
        
        if personality == "sarcastic":
            response += " 🙄"
        elif personality == "cheerful":
            response += " 😊"
        elif personality == "mysterious":
            response += " ..."
        elif personality == "shy" and affinity_level in [AffinityLevel.STRANGER, AffinityLevel.ACQUAINTANCE]:
            response = "..." + response.lower()
        
        # Mention de la tour parfois
        if random.random() > 0.7:
            response += f" Je suis actuellement à l'étage {npc_data.get('current_floor', 0)}."
        
        return response
    
    async def _generate_real_ai_response(
        self,
        npc_data: Dict[str, Any],
        user_message: str,
        conversation_history: List[Dict[str, str]],
        affinity_level: AffinityLevel,
        affinity_points: int,
        user_floor: int,
        user_room: int
    ) -> str:
        """Génère une vraie réponse IA avec Gemini"""
        
        # Préparer le system prompt
        system_prompt = BASE_SYSTEM_PROMPT.format(
            npc_name=npc_data.get("name", "NPC"),
            universe_description=UNIVERSE_CONFIG["description"],
            personality=npc_data.get("personality", "friendly"),
            conversation_style=npc_data.get("conversation_style", ""),
            current_floor=npc_data.get("current_floor", 0),
            current_room=npc_data.get("current_room", 0),
            current_time=datetime.now().strftime("%Y-%m-%d %H:%M (an 2316)"),
            user_floor=user_floor,
            user_room=user_room,
            affinity_level=affinity_level.value,
            affinity_points=affinity_points,
            revealed_info=" / ".join(npc_data.get("revealed_info", ["Aucune info révélée"]))
        )
        
        # TODO: Implémenter l'appel réel à Gemini quand l'utilisateur est prêt
        # For now, return mock
        return self._generate_mock_response(npc_data, user_message, affinity_level, affinity_points)
    
    def calculate_affinity_change(self, user_message: str, npc_personality: str) -> int:
        """Calcule le changement d'affinité basé sur le message"""
        
        # Simple heuristic for now
        message_lower = user_message.lower()
        
        # Positive keywords
        positive_words = ["merci", "aide", "ami", "cool", "super", "génial", "sympa", "content"]
        negative_words = ["nul", "stupide", "idiot", "ennuyeux", "laisse", "tais"]
        
        change = 2  # Base change for interaction
        
        for word in positive_words:
            if word in message_lower:
                change += 3
                break
        
        for word in negative_words:
            if word in message_lower:
                change -= 5
                break
        
        # Longer messages show more engagement
        if len(user_message) > 50:
            change += 1
        
        return max(-10, min(10, change))  # Cap between -10 and +10

# Global instance
ai_service = AIService()
