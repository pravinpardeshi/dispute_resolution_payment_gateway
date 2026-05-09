from qdrant_client import QdrantClient
from qdrant_client.models import SearchRequest

client = QdrantClient(host="localhost", port=6333)


def search_similar(state):
    """
    Expects:
    state["vector"] = embedding vector
    """

    vector = state.get("vector")

    if not vector:
        return []

    results = client.query_points(
        collection_name="disputes",
        query=vector,
        limit=5,
        with_payload=True,
        with_vectors=False
    )

    return [
        {
            "id": r.id,
            "score": r.score,
            "payload": r.payload
        }
        for r in results.points
    ]