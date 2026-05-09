# Payment Gateway Dispute Resolution AI Engine

A modern web application for analyzing and resolving payment disputes using AI and LangGraph workflows.

## Features

- **AI-Powered Analysis**: Uses LangGraph for structured dispute investigation
- **Real-time Processing**: Asynchronous investigation with live status updates
- **Responsive Design**: Resizable panels for optimal viewing experience
- **Theme Toggle**: Dark/Light mode with animated icon switching
- **Modern UI**: Clean, card-based interface with smooth transitions

## Technology Stack

- **Backend**: FastAPI (Python)
- **AI Framework**: LangGraph workflow orchestration
- **LLM Integration**: Ollama for local AI processing
- **Frontend**: Vanilla JavaScript with modern CSS
- **Styling**: CSS Grid/Flexbox with CSS variables for theming
- **Containerization**: Docker for easy deployment

## Quick Start

### Using Docker (Recommended)

1. **Build the Docker image:**
   ```bash
   docker build -t payment-gateway .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8010:8010 payment-gateway
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:8010`

### Manual Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8010
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:8010`

## Usage Guide

1. **Generate Case Data**: Click "Generate Case" to create sample dispute data
2. **Run Investigation**: Click "Run Investigation" to start AI analysis
3. **Monitor Progress**: Watch real-time status updates during processing
4. **View Results**: Review AI decision, confidence, and recommendations
5. **Customize Layout**: Drag the divider to resize panels as needed
6. **Toggle Theme**: Use the theme icon to switch between dark/light modes

## API Endpoints

- `GET /` - Main application interface
- `POST /synthetic` - Generate sample dispute data
- `POST /dispute/run` - Start async dispute investigation
- `GET /dispute/status/{task_id}` - Check investigation status

## Development

### Project Structure

```
├── main.py              # FastAPI application entry point
├── app/
│   ├── graph.py         # LangGraph workflow definition
│   ├── llm.py           # LLM integration layer
│   ├── synthetic.py     # Test data generation
|   ├── models.py        # Pydantic Models
|   └── qdrant.py        # Qdrant integration
├── static/
│   ├── index.html       # Main web interface
│   ├── style.css        # Styling and theme variables
│   └── script.js        # Frontend JavaScript logic
├── requirements.txt     # Python dependencies
├── Dockerfile           # Container configuration
└── README.md            # This file
```

## Configuration

The application uses environment variables and local storage for configuration:

- **Theme Preference**: Stored in `localStorage`
- **Task Storage**: In-memory task store (production: use Redis/DB)
- **LLM Settings**: Configured in `app/llm.py`
- **Port**: Default 8010 (configurable via Docker)

## Docker Deployment
From the folder that has the Dockerfile run following command to build the docker container (note the period '.' at the end of the command);
docker build -t payment-gateway .

### Production Deployment

```bash
# Build and run with environment variables
docker run -d \
  --name payment-gateway \
  -p 8010:8010 \
  -e LLM_HOST=your-llm-host \
  -e LLM_PORT=11434 \
  payment-gateway
```

### Docker Compose (Optional)

Create `docker-compose.yml` for multi-service deployments:

```yaml
version: '3.8'
services:
  payment-gateway:
    build: .
    ports:
      - "8010:8010"
    environment:
      - LLM_HOST=localhost
      - LLM_PORT=11434
    volumes:
      - ./data:/app/data
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.
