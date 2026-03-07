<template>
  <div class="app-container">

    <div class="content-wrapper">

      <header class="header">
        <h1>MoodAI</h1>
        <p>Share your mood and get a supportive AI response.</p>
      </header>

      <main class="main-content">

        <section class="form-section">
          <div class="form-card">

            <h2>Mood Check-in</h2>

            <input
              v-model="name"
              placeholder="Your name"
              autocomplete="off"
            />

            <textarea
              v-model="mood"
              placeholder="How are you feeling today?"
            ></textarea>

            <button @click="submitMood" :disabled="loading">
              {{ loading ? "Processing..." : "Submit Mood" }}
            </button>

          </div>
        </section>

        <section class="history-section" v-if="history.length > 0">

          <h3>Mood History</h3>

          <table class="db-table" aria-label="Mood history table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mood</th>
                <th>AI Message</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(entry, index) in history" :key="index">
                <td>{{ entry.full_name }}</td>
                <td>{{ entry.mood_text }}</td>
                <td>{{ entry.ai_message }}</td>
              </tr>
            </tbody>
          </table>

          <p class="stats">{{ history.length }} row(s) in set</p>

        </section>

      </main>

      <footer class="footer">
        © 2026 MoodAI • Built with Vue & AI
      </footer>

    </div>

  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      name: "",
      mood: "",
      aiMessage: "",
      loading: false,
      history: [],
    };
  },

  mounted() {
    this.fetchHistory();
  },

  methods: {
    async fetchHistory() {
      try {
        const res = await api.get("/moods");
        this.history = res.data;
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    },

    async submitMood() {
      if (!this.name || !this.mood) {
        return alert("Please fill in both fields");
      }

      this.loading = true;

      try {
        const res = await api.post("/moods", {
          full_name: this.name,
          mood_text: this.mood,
        });

        this.aiMessage = res.data.ai_message;

        await this.fetchHistory();

        this.mood = "";
      } catch (err) {
        alert("Submit failed. Make sure the server is running on port 3000.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* FULL VIEWPORT CONTAINER */
.app-container {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #67e8f9, #22d3ee);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #0f172a;
}

/* CENTERED CONTENT WRAPPER */
.content-wrapper {
  background: #ffffffee;
  border-radius: 20px;
  box-shadow: 0 25px 40px rgba(0, 0, 0, 0.12);
  max-width: 960px;
  width: 100%;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  box-sizing: border-box;
}

/* HEADER */
.header {
  text-align: center;
  user-select: none;
}
.header h1 {
  margin: 0 0 8px;
  font-weight: 800;
  font-size: 3rem;
  letter-spacing: 1.1px;
  color: #0c4a6e;
}
.header p {
  margin: 0;
  font-weight: 500;
  font-size: 1.1rem;
  color: #475569;
}

/* MAIN CONTENT */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* FORM SECTION */
.form-section {
  width: 100%;
}

.form-card {
  background: white;
  padding: 40px 50px;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgb(34 211 238 / 0.3);
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: box-shadow 0.3s ease;
}
.form-card:hover {
  box-shadow: 0 25px 60px rgb(34 211 238 / 0.5);
}

.form-card h2 {
  text-align: center;
  font-weight: 700;
  font-size: 2.2rem;
  color: #0e7490;
  margin-bottom: 0;
}

/* INPUTS */
input,
textarea {
  width: 100%;
  padding: 16px 22px;
  border-radius: 14px;
  border: 1.5px solid #94a3b8;
  font-size: 18px;
  font-weight: 500;
  color: #334155;
  background: #f8fafc;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
input::placeholder,
textarea::placeholder {
  color: #94a3b8;
  font-weight: 400;
  font-style: italic;
}
input:focus,
textarea:focus {
  outline: none;
  border-color: #06b6d4;
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.25);
  background: white;
}
textarea {
  min-height: 140px;
  resize: vertical;
}

/* BUTTON */
button {
  width: 100%;
  padding: 18px 0;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #06b6d4, #22d3ee);
  color: white;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: box-shadow 0.25s ease, transform 0.2s ease;
  user-select: none;
}
button:hover:not(:disabled) {
  box-shadow: 0 10px 40px rgba(6, 182, 212, 0.7);
  transform: translateY(-3px);
}
button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

/* HISTORY SECTION */
.history-section {
  width: 100%;
  overflow-x: auto;
}

.history-section h3 {
  font-weight: 700;
  font-size: 2rem;
  color: #0c4a6e;
  margin-bottom: 20px;
  text-align: center;
}

/* TABLE */
.db-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
  min-width: 700px;
  font-weight: 500;
  color: #334155;
}
.db-table th,
.db-table td {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}
.db-table th {
  background: #06b6d4;
  color: white;
  font-weight: 700;
}
.db-table tr:nth-child(even) {
  background: #f1f5f9;
}
.db-table tr:hover {
  background: #bae6fd;
  transition: background-color 0.3s ease;
}

/* STATS */
.stats {
  margin-top: 18px;
  font-size: 16px;
  color: #475569;
  text-align: right;
}

/* FOOTER */
.footer {
  margin-top: 30px;
  font-weight: 600;
  color: #64748b;
  text-align: center;
  user-select: none;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 30px;
  }
  .form-card {
    padding: 30px 30px;
  }
  .header h1 {
    font-size: 2.4rem;
  }
  .header p {
    font-size: 1rem;
  }
  button {
    font-size: 16px;
  }
  .db-table {
    font-size: 16px;
    min-width: 100%;
  }
}
</style>