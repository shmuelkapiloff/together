# 📚 תיעוד Simple Shop

> **מבנה ניווט מקצועי לכל תיעוד הפרויקט**

---

## 🗺️ מפת התיעוד

### 📘 **guides/** - הצגה והגשה
מטרה: חומר להצגה בכיתה ולהגשה רשמית

| קובץ | מטרה | קהל יעד |
|------|------|---------|
| **FINAL_PROJECT_BOOK_HE.md** | ⭐ **ספר הפרויקט המלא** - מסמך הגשה | מנחה, בוחן |
| FINAL_PROJECT_BOOK_HE_PRESENTATION.md | גרסה קצרה (10-15 עמודים) | הצגה בכיתה |
| FINAL_PROJECT_BOOK_HE_10_MIN_TALK_HE.md | תסריט הרצאה ב-10 דקות | הצגה בעל פה |
| CLIENT_GUIDE.md | מדריך פיתוח צד לקוח | Frontend developer |

---

### 🔧 **technical/** - ליבה ארכיטקטונית ותכנית
מטרה: עומק טכני וארכיטקטונה

| קובץ | מטרה | קהל יעד |
|------|------|---------|
| ARCHITECTURE_NARRATIVE.md | פילוסופיה עיצוב + החלטות עיקריות | Architect, מנחה |
| ALL_API_REQUEST_STRUCTURE_PRO_HE.md | מפת API מלאה (Flow + Contract + Errors) | API integrations |
| PAYMENT_SYSTEM_DESIGN.md | Deep dive - Stripe + Webhook + Idempotency | Backend engineer |
| DATABASE_SCHEMA_COMPLETE.md | סכמת MongoDB עם דיאגרמות | DBA, backend |
| DB_DIAGRAM_PROFESSIONAL.md | **דיאגרמה מקצועית של DB** ✨ | הצגה, תיעוד |
| DATA_FLOW_DIAGRAM.md | **דיאגרמת זרימת מידע** ✨ | הבנת הזרימה |
| DEPLOYMENT_GUIDE.md | הפקה ל-production (Render, AWS) | DevOps, deployment |

---

### 🔐 **security/** - אבטחה
מטרה: תיעוד אבטחה

| קובץ | מטרה | קהל יעד |
|------|------|---------|
| SECURITY_DESIGN_DECISIONS.md | כל החלטה אבטחה + נימוק | Security engineer |
| SECURITY_AUDIT.md | ביקורת OWASP Top 10 | מנחה, ביקורת |

---

## 🎯 איך להשתמש בתיעוד

### למנחה / בוחן הגשה:
```
1. קרא את: guides/FINAL_PROJECT_BOOK_HE.md
   ↓
2. אם צריך עומק טכני: technical/ARCHITECTURE_NARRATIVE.md
   ↓
3. אם צריך אבטחה: security/SECURITY_AUDIT.md
```

### למתכנת שמגן על הפרויקט:
```
1. התחל עם: guides/FINAL_PROJECT_BOOK_HE_PRESENTATION.md (overview)
   ↓
2. עמוק טכני: technical/ARCHITECTURE_NARRATIVE.md
   ↓
3. API integrations: technical/ALL_API_REQUEST_STRUCTURE_PRO_HE.md
   ↓
4. Payment flow: technical/PAYMENT_SYSTEM_DESIGN.md
```

### ל-Frontend developer (חבר):
```
1. קרא את: guides/CLIENT_GUIDE.md
   ↓
2. API endpoints: technical/ALL_API_REQUEST_STRUCTURE_PRO_HE.md
```

---

## ✅ תוכן כל תיקייה

### 📁 `/guides`
- **FINAL_PROJECT_BOOK_HE.md** (200+ עמודים)
  - מבוא + בעיה + פתרון
  - ארכיטקטורה מלאה
  - קוד מודלים וקונטרולרים
  - אבטחה וביצועים
  - דיאגרמות Mermaid
  - בדיקות וקו"ד

- קבצים נוספים: PRESENTATION, TALK, CLIENT_GUIDE

### 📁 `/technical`
- **ARCHITECTURE_NARRATIVE.md** - "למה" עשינו כל דבר
- **PAYMENT_SYSTEM_DESIGN.md** - Payment flow עומק מלא
- **ALL_API_REQUEST_STRUCTURE_PRO_HE.md** - API reference מלא
- **DATABASE_SCHEMA_COMPLETE.md** - סכמת DB מעמיקה
- **DB_DIAGRAM_PROFESSIONAL.md** - תרשים ויזואלי
- **DATA_FLOW_DIAGRAM.md** - זרימת מידע בין חלקים
- **DEPLOYMENT_GUIDE.md** - הפקה לייצור
- קבצים אחרים: ביטחון, אבטחה

### 📁 `/security`
- **SECURITY_DESIGN_DECISIONS.md** - כל החלטה אבטחה
- **SECURITY_AUDIT.md** - ביקורת OWASP

---

## 🚀 טיפ מהיר

**צריך תשובה מהירה?**
- הצגה בכיתה → `FINAL_PROJECT_BOOK_HE_PRESENTATION.md`
- API endpoint → `ALL_API_REQUEST_STRUCTURE_PRO_HE.md`
- סיבה עיצובית → `ARCHITECTURE_NARRATIVE.md`
- בעיה אבטחה → `SECURITY_DESIGN_DECISIONS.md`

**צריך קוד?**
- מודלים → `FINAL_PROJECT_BOOK_HE.md` (חלק ב')
- Stripe → `PAYMENT_SYSTEM_DESIGN.md`
- Auth → `FINAL_PROJECT_BOOK_HE.md` (Auth section)

---

## 📊 דיאגרמות מרכזיות

### דיאגרמת Database
👉 [DB_DIAGRAM_PROFESSIONAL.md](./technical/DB_DIAGRAM_PROFESSIONAL.md)

### דיאגרמת זרימת מידע
👉 [DATA_FLOW_DIAGRAM.md](./technical/DATA_FLOW_DIAGRAM.md)

### דיאגרמות בתוך הספר
👉 [FINAL_PROJECT_BOOK_HE.md - חלק ב'](./guides/FINAL_PROJECT_BOOK_HE.md)

---

**עדכון אחרון:** 19/05/2026  
**מצב:** ✅ סופי להגשה
