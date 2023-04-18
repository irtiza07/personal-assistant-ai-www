from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from llama_index import GPTSimpleVectorIndex


app = FastAPI()

# Define allowed origins
origins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:8000",
    "http://localhost:8080",
]
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/answers")
async def get_answer(question: str):
    index = GPTSimpleVectorIndex.load_from_disk("generated_index.json")
    answer = index.query(question)

    return {"answer": answer.response}
