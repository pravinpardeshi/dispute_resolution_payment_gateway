import random
import uuid
from datetime import datetime


MERCHANTS = ["Star Coffee", "Apple Store", "Amazon", "Walmart"]


def generate_transaction():
    return {
        "transaction_id": str(uuid.uuid4()),
        "amount": round(random.uniform(5, 200), 2),
        "timestamp": str(datetime.utcnow()),
        "auth_code": f"AUTH{random.randint(1000,9999)}"
    }


def generate_dispute():
    txs = [generate_transaction(), generate_transaction()]

    return {
        "customer": {
            "customer_id": str(uuid.uuid4()),
            "statement": "I was charged twice for my purchase"
        },
        "merchant_data": {
            "merchant_name": random.choice(MERCHANTS),
            "transactions": txs
        },
        "visa_data": {
            "status": "APPROVED"
        },
        "internal_data": {
            "settled": True
        }
    }