import random
import uuid
from datetime import datetime, timedelta

MERCHANTS = ["Star Coffee", "Apple Store", "Amazon", "Walmart"]

def random_tx():
    return {
        "transaction_id": str(uuid.uuid4()),
        "amount": round(random.uniform(5, 200), 2),
        "timestamp": str(datetime.utcnow()),
        "auth_code": f"AUTH{random.randint(1000,9999)}"
    }

def generate_dispute():

    txs = [random_tx(), random_tx()]

    return {
        "customer": {
            "id": str(uuid.uuid4()),
            "statement": "I was charged twice"
        },
        "merchant_data": {
            "merchant": random.choice(MERCHANTS),
            "transactions": txs
        },
        "visa_data": {
            "status": "APPROVED"
        },
        "internal_data": {
            "settled": True
        }
    }
    