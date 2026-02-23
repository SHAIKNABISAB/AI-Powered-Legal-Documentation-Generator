# LegalEase: AI-Powered Legal Documentation Generator

## 🎉 Deployment Successful!

**Live Frontend URL:** https://412kh5.vercel.app

---

## 📝 Project Overview

LegalEase is a complete full-stack application that generates professional legal documents using Google Gemini AI. It features a modern React frontend and Flask backend with document download capabilities.

---

## ✅ Completed Features

### 📄 Document Types (9 Supported)
1. ✅ **Employment Contract** - With position, salary, start date, location
2. ✅ **Lease Agreement** - With landlord/tenant details, rent, deposit
3. ✅ **Non-Disclosure Agreement (NDA)** - With confidentiality terms
4. ✅ **Partnership Agreement** - With profit sharing, business details
5. ✅ **Service Agreement** - With scope, payment terms, duration
6. ✅ **Settlement Agreement** - With dispute resolution terms
7. ✅ **Freelance Contract** - With milestones, deliverables
8. ✅ **Terms of Service** - With governing law, age restrictions
9. ✅ **Domicile Agreement** - With residency terms, services

### 🤖 AI Integration
- ✅ Google Gemini 1.5 Flash model
- ✅ Dynamic prompts per document type
- ✅ Professional legal language generation
- ✅ Proper document structure with all required sections

### 📁 Download Feature
- ✅ Microsoft Word (.docx) export
- ✅ Professional formatting with headers
- ✅ Signature blocks included
- ✅ Proper spacing and typography
- ✅ Filename format: `LegalEase_<DocumentType>_<Date>.docx`

### 🎨 UI/UX
- ✅ Bright, professional theme
- ✅ White/blue color scheme
- ✅ Clean card-based layout
- ✅ Loading indicators and spinners
- ✅ Input validation
- ✅ Error handling with user-friendly messages
- ✅ Success notifications
- ✅ Responsive design (mobile & desktop)

### 🛡️ Security & Best Practices
- ✅ API key stored in `.env` file
- ✅ python-dotenv for environment variables
- ✅ CORS enabled for frontend communication
- ✅ Input validation on all fields
- ✅ Proper error handling

---

## 📁 File Structure

```
legalease/
├── backend/
│   ├── app.py                 # Flask backend with Gemini API
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (API key)
│   └── .env.example           # Environment template
├── src/
│   ├── App.tsx               # React main application
│   ├── index.css             # Global styles
│   └── main.tsx              # React entry point
├── index.html              # HTML template
├── package.json            # Node.js dependencies
├── vite.config.ts          # Vite configuration
├── start-dev.sh            # Linux/Mac startup script
├── start-dev.bat           # Windows startup script
└── README.md               # Full documentation
```

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.8+
- Node.js 18+
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Quick Start (Linux/Mac)
```bash
# 1. Setup environment
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 2. Run startup script
cd ..
./start-dev.sh
```

### Quick Start (Windows)
```bash
# 1. Setup environment
cd backend
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 2. Run startup script
cd ..
start-dev.bat
```

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Backend runs on http://localhost:5000
```

**Frontend:**
```bash
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info & health check |
| `/document-types` | GET | List available document types |
| `/generate` | POST | Generate legal document |
| `/download-doc` | POST | Download as Word file |

---

## 📝 Environment Variables

Create `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🎨 Document Format

All generated documents include:
- 📄 Title & Header
- 👥 Parties Section
- 📜 Definitions (where applicable)
- 📋 Terms & Conditions
- 💼 Obligations
- 💳 Payment Terms
- ⏰ Duration
- ⚠️ Termination Clause
- 🔐 Confidentiality
- ⚖️ Governing Law
- ✍️ Signatures Section

---

## 📱 Screenshots

### Home Page
- Document type selection cards
- 9 document types with icons
- Clean, professional layout

### Form Page
- Dynamic form fields per document type
- Input validation
- Generate button with loading state

### Preview Page
- Generated document display
- Formatted text with headings
- Download as Word button

---

## 📝 Dependencies

### Backend
```
Flask==3.0.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
google-generativeai==0.3.2
python-docx==1.1.0
```

### Frontend
```
React 19
TypeScript
Tailwind CSS 4
Framer Motion
Lucide React
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure backend is running on port 5000 |
| API key errors | Check `.env` file has valid GEMINI_API_KEY |
| Port already in use | Change ports in `app.py` or `vite.config.ts` |
| Module not found | Run `pip install -r requirements.txt` |

---

## 🚀 Production Deployment

### Backend
Deploy `backend/` folder to:
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Python Anywhere

Set environment variable: `GEMINI_API_KEY`

### Frontend
The frontend is already deployed to Vercel!

For custom deployment:
```bash
npm run build
# Deploy `dist/` folder to any static host
```

---

## ⚠️ Legal Disclaimer

Documents generated by LegalEase are for informational purposes only and should be reviewed by a qualified legal professional before use. AI-generated documents may not comply with all local laws and regulations.

---

## 🌟 Key Highlights

✅ **9 Document Types** - Complete coverage of common legal documents  
✅ **AI-Powered** - Google Gemini generates professional legal text  
✅ **Word Export** - Download formatted .docx files  
✅ **Bright Theme** - Modern, professional UI  
✅ **Input Validation** - Prevents errors before submission  
✅ **Error Handling** - User-friendly error messages  
✅ **Responsive** - Works on all devices  
✅ **Production Ready** - Clean, modular code  

---

**Built with ❤️ using Google Gemini AI & React**

© 2025 LegalEase