from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, HTMLResponse
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv
import secrets

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.contact_app
qr_codes_collection = db.qr_codes


class ContactInfo(BaseModel):
    phone: str
    email: str
    website: str


class QRCodeCreate(BaseModel):
    phone: str
    email: str
    website: str


@app.get("/")
async def root():
    return {"message": "Contact App API", "status": "running"}


@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.post("/api/qr/create")
async def create_qr_code(contact: QRCodeCreate):
    """Create a new dynamic QR code"""
    # Generate unique ID
    qr_id = secrets.token_urlsafe(8)
    
    # Check if ID already exists (very unlikely)
    while await qr_codes_collection.find_one({"qr_id": qr_id}):
        qr_id = secrets.token_urlsafe(8)
    
    # Store in database
    qr_data = {
        "qr_id": qr_id,
        "phone": contact.phone,
        "email": contact.email,
        "website": contact.website,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "scan_count": 0
    }
    
    await qr_codes_collection.insert_one(qr_data)
    
    return {
        "qr_id": qr_id,
        "qr_url": f"/api/qr/{qr_id}",
        "edit_url": f"/edit/{qr_id}",
        "message": "QR code created successfully"
    }


@app.get("/api/qr/{qr_id}")
async def redirect_qr(qr_id: str):
    """Redirect to app with current contact info"""
    qr_data = await qr_codes_collection.find_one({"qr_id": qr_id})
    
    if not qr_data:
        raise HTTPException(status_code=404, detail="QR code not found")
    
    # Increment scan count
    await qr_codes_collection.update_one(
        {"qr_id": qr_id},
        {"$inc": {"scan_count": 1}}
    )
    
    # Build redirect URL with parameters
    base_url = "https://contact-app.preview.emergentagent.com"
    redirect_url = f"{base_url}?phone={qr_data['phone']}&email={qr_data['email']}&website={qr_data['website']}"
    
    return RedirectResponse(url=redirect_url)


@app.get("/api/qr/{qr_id}/info")
async def get_qr_info(qr_id: str):
    """Get current QR code information"""
    qr_data = await qr_codes_collection.find_one({"qr_id": qr_id})
    
    if not qr_data:
        raise HTTPException(status_code=404, detail="QR code not found")
    
    # Remove MongoDB _id from response
    qr_data.pop("_id", None)
    
    return qr_data


@app.put("/api/qr/{qr_id}")
async def update_qr_code(qr_id: str, contact: ContactInfo):
    """Update QR code contact information"""
    qr_data = await qr_codes_collection.find_one({"qr_id": qr_id})
    
    if not qr_data:
        raise HTTPException(status_code=404, detail="QR code not found")
    
    # Update information
    await qr_codes_collection.update_one(
        {"qr_id": qr_id},
        {
            "$set": {
                "phone": contact.phone,
                "email": contact.email,
                "website": contact.website,
                "updated_at": datetime.now().isoformat()
            }
        }
    )
    
    return {"message": "QR code updated successfully"}


@app.get("/edit/{qr_id}", response_class=HTMLResponse)
async def edit_page(qr_id: str):
    """Serve edit page for QR code"""
    qr_data = await qr_codes_collection.find_one({"qr_id": qr_id})
    
    if not qr_data:
        return HTMLResponse(content="<h1>QR Code not found</h1>", status_code=404)
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Éditer QR Code - {qr_id}</title>
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }}
            .container {{
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                padding: 40px;
                max-width: 600px;
                width: 100%;
            }}
            h1 {{
                text-align: center;
                color: #667eea;
                margin-bottom: 10px;
                font-size: 28px;
            }}
            .subtitle {{
                text-align: center;
                color: #666;
                margin-bottom: 30px;
                font-size: 14px;
            }}
            .info-box {{
                background: #f0f4ff;
                border-left: 4px solid #667eea;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 13px;
                color: #555;
            }}
            .form-group {{
                margin-bottom: 20px;
            }}
            label {{
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 600;
                font-size: 14px;
            }}
            input {{
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 16px;
                transition: all 0.3s ease;
            }}
            input:focus {{
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }}
            button {{
                width: 100%;
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }}
            button:hover {{
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }}
            .success-message {{
                background: #d1fae5;
                border-left: 4px solid #10b981;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                display: none;
                color: #065f46;
                font-weight: 600;
            }}
            .stats {{
                background: #fff7ed;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 13px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✏️ Éditer QR Code</h1>
            <p class="subtitle">ID: {qr_id}</p>
            
            <div class="stats">
                <strong>📊 Statistiques:</strong><br>
                Scans: <strong id="scanCount">{qr_data.get('scan_count', 0)}</strong><br>
                Créé: {qr_data.get('created_at', 'N/A')[:10]}<br>
                Modifié: {qr_data.get('updated_at', 'N/A')[:10]}
            </div>
            
            <div class="info-box">
                <strong>ℹ️ Note:</strong> Les modifications seront appliquées immédiatement. Tous les QR codes existants utiliseront les nouvelles informations!
            </div>
            
            <form id="editForm">
                <div class="form-group">
                    <label for="phone">📞 Numéro de Téléphone</label>
                    <input type="tel" id="phone" value="{qr_data.get('phone', '')}" required>
                </div>
                
                <div class="form-group">
                    <label for="email">📧 Adresse Email</label>
                    <input type="email" id="email" value="{qr_data.get('email', '')}" required>
                </div>
                
                <div class="form-group">
                    <label for="website">🌐 Site Web / Portfolio</label>
                    <input type="url" id="website" value="{qr_data.get('website', '')}" required>
                </div>
                
                <button type="submit">💾 Enregistrer les modifications</button>
                
                <div class="success-message" id="successMsg">
                    ✅ Modifications enregistrées avec succès!
                </div>
            </form>
        </div>
        
        <script>
            const form = document.getElementById('editForm');
            const successMsg = document.getElementById('successMsg');
            
            form.addEventListener('submit', async function(e) {{
                e.preventDefault();
                
                const phone = document.getElementById('phone').value;
                const email = document.getElementById('email').value;
                const website = document.getElementById('website').value;
                
                try {{
                    const response = await fetch('/api/qr/{qr_id}', {{
                        method: 'PUT',
                        headers: {{
                            'Content-Type': 'application/json',
                        }},
                        body: JSON.stringify({{
                            phone: phone,
                            email: email,
                            website: website
                        }})
                    }});
                    
                    if (response.ok) {{
                        successMsg.style.display = 'block';
                        setTimeout(() => {{
                            successMsg.style.display = 'none';
                        }}, 3000);
                    }} else {{
                        alert('Erreur lors de la sauvegarde');
                    }}
                }} catch (error) {{
                    alert('Erreur: ' + error.message);
                }}
            }});
        </script>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
