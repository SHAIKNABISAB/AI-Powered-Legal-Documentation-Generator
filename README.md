# LegalEase: AI-Powered Legal Documentation Generator

A professional legal document generator powered by Google Gemini AI. Create legally structured documents including employment contracts, lease agreements, NDAs, and more in seconds.

![LegalEase](https://img.shields.io/badge/LegalEase-AI%20Powered-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey)
![React](https://img.shields.io/badge/React-18-61dafb)

## ✅ Features

### Document Types (9 Supported)
1. **Employment Contract** - Professional employment agreements
2. **Lease Agreement** - Residential lease contracts
3. **Non-Disclosure Agreement (NDA)** - Confidentiality protection
4. **Partnership Agreement** - Business partnership terms
5. **Service Agreement** - Service provider contracts
6. **Settlement Agreement** - Dispute resolution documents
7. **Freelance Contract** - Independent contractor agreements
8. **Terms of Service** - Website/app legal terms
9. **Domicile Agreement** - Residency and accommodation contracts

### Key Capabilities
- ✨ **AI-Powered Generation** - Uses Google Gemini 1.5 Flash for high-quality legal content
- 📝 **Professional Formatting** - Real-world legal document structure
- 📁 **Word Download** - Export documents as formatted .docx files
- 🎨 **Modern UI** - Clean, bright, professional interface
- ⚡ **Fast & Responsive** - Quick generation with loading states
- 🛡️ **Input Validation** - Prevents errors before submission
- 🌐 **CORS Enabled** - Frontend/Backend communication ready

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd legalease
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env file and add your GEMINI_API_KEY
```

### 3. Configure API Key

### 4. Start Backend Server

```bash
# In backend directory with venv activated
python app.py
```

Backend will start on `http://localhost:5000`

### 5. Frontend Setup

Open a new terminal:

```bash
# Navigate to project root
cd legalease

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on `http://localhost:5173`

### 6. Open Application

Navigate to `http://localhost:5173` in your browser.

## 📁 Project Structure

```
legalease/
├── backend/
│   ├── app.py                 # Flask backend with Gemini API
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (API key)
│   └── .env.example           # Environment template
├── src/
│   ├── App.tsx               # React main application
│   ├── index.css             # Styles
│   └── main.tsx              # React entry point
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## 🔧 API Endpoints

### `GET /`
Health check and API information.

### `GET /document-types`
Returns available document types and their required fields.

### `POST /generate`
Generates a legal document.

**Request Body:**
```json
{
  "document_type": "employment_contract",
  "details": {
    "employer_name": "Acme Corp",
    "employee_name": "John Doe",
    "position": "Software Engineer",
    "start_date": "2025-01-15",
    "salary": "$80,000 per year",
    "work_location": "New York, NY",
    "employment_type": "Full-Time"
  }
}
```

**Response:**
```json
{
  "success": true,
  "document_type": "employment_contract",
  "document_title": "Employment Contract",
  "document_text": "EMPLOYMENT CONTRACT\n\nThis Employment Contract...",
  "generated_at": "2025-01-10T12:00:00",
  "message": "Document generated successfully"
}
```

### `POST /download-doc`
Downloads the generated document as a Word file.

**Request Body:**
```json
{
  "document_type": "employment_contract",
  "document_text": "Document content here..."
}
```

**Response:** Binary .docx file

## 🎨 Document Format

All generated documents include:
- **Title** - Document type header
- **Parties** - Involved parties identification
- **Definitions** - Key terms (where applicable)
- **Terms & Conditions** - Core agreement terms
- **Obligations** - Responsibilities of each party
- **Payment Terms** - Financial arrangements
- **Duration** - Agreement timeline
- **Termination Clause** - Exit conditions
- **Confidentiality** - Privacy provisions (where applicable)
- **Governing Law** - Jurisdiction
- **Signatures** - Signature block section

## 📝 Document Field Reference

### Employment Contract
- employer_name, employee_name, position, start_date, salary, work_location, employment_type

### Lease Agreement
- landlord_name, tenant_name, property_address, lease_start, lease_end, monthly_rent, security_deposit

### NDA
- disclosing_party, receiving_party, effective_date, jurisdiction, term_years

### Partnership Agreement
- partner_one, partner_two, business_name, business_address, start_date, profit_sharing, duration

### Service Agreement
- service_provider, client_name, service_description, start_date, end_date, payment_amount, payment_terms

### Settlement Agreement
- party_one, party_two, dispute_description, settlement_amount, settlement_date, confidentiality_required

### Freelance Contract
- freelancer_name, client_name, project_description, start_date, deadline, total_payment, milestone_payment

### Terms of Service
- company_name, website_url, effective_date, governing_law, minimum_age

### Domicile Agreement
- resident_name, property_owner, property_address, start_date, monthly_fee, services_included

## 🛡️ Security

- API keys stored in `.env` file (never committed)
- Input validation on all fields
- CORS properly configured
- No sensitive data logged

## ⚠️ Legal Disclaimer

**Important:** Documents generated by LegalEase are for informational purposes only and should be reviewed by a qualified legal professional before use. AI-generated documents may not comply with all local laws and regulations.

## 📝 Dependencies

### Backend
- Flask 3.0.0 - Web framework
- Flask-CORS 4.0.0 - Cross-origin requests
- python-dotenv 1.0.0 - Environment variables
- google-generativeai 0.3.2 - Gemini API
- python-docx 1.1.0 - Word document generation

### Frontend
- React 18 - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Framer Motion - Animations
- Lucide React - Icons

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process or change port in app.py
```

### CORS errors
Ensure backend is running and CORS is properly configured in `app.py`.

### Gemini API errors
- Verify your API key is correct
- Check API quota at [Google AI Studio](https://makersuite.google.com)
- Ensure `GEMINI_API_KEY` is set in `backend/.env`

### Frontend can't connect to backend
- Ensure both servers are running
- Check that `API_BASE_URL` in `src/App.tsx` matches your backend URL

## 🚀 Production Deployment

### Backend (e.g., Heroku, AWS, GCP)
```bash
# Install gunicorn (included in requirements.txt)
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

### Frontend (e.g., Vercel, Netlify)
```bash
# Build for production
npm run build

# Deploy dist/ folder
```

Update `API_BASE_URL` in frontend to point to production backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For issues and questions:
- Open a GitHub issue
- Contact: support@legalease.ai

---

**Built with ❤️ using Google Gemini AI**
