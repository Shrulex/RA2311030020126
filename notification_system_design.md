# 📢 Campus Notification System Design

---

## 🔹 Stage 1: API Design

### 1. Create Notification
**POST /notifications**

**Request Body:**
```json
{
  "title": "Placement Drive",
  "message": "Company XYZ hiring",
  "type": "placement",
  "recipients": ["student_id_1", "student_id_2"]
}
