import streamlit as st

# Nastavenie stránky
st.set_page_config(
    page_title="M.I.A. | AI Sommelier & Ecosystem",
    layout="wide",
    initial_sidebar_state="expanded",
)

# LUXUSNÝ VIZUÁLNY CSS DIZAJN (Štýl Zaha Hadid - temné tóny, smaragd, čisté línie)
st.markdown(
    """
    <style>
    /* Celkové pozadie a fonty */
    .stApp {
        background-color: #0f1110;
        color: #f0f2f1;
        font-family: 'Inter', sans-serif;
    }
    
    /* Sidebar styling */
    section[data-testid="stSidebar"] {
        background-color: #161917;
        border-right: 1px solid #262c29;
    }
    
    /* Karty a boxy - organické zaoblenie */
    div.stButton > button {
        background: linear-gradient(135deg, #0d5c3f 0%, #104532 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.6rem 1.2rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    div.stButton > button:hover {
        background: linear-gradient(135deg, #10704e 0%, #0d5c3f 100%);
        box-shadow: 0 4px 12px rgba(13, 92, 63, 0.4);
    }
    
    /* Metriky a dashboard boxy */
    div[data-testid="metric-container"] {
        background-color: #161917;
        border: 1px solid #262c29;
        padding: 15px;
        border-radius: 10px;
    }
    
    /* Nadpisy */
    h1, h2, h3 {
        color: #e2e8e4;
        font-weight: 400;
        letter-spacing: -0.5px;
    }
    </style>
""",
    unsafe_allow_html=True,
)

# REÁLNA DATABÁZA PRODUKTOV
WINE_DATABASE = {
    "Valdobbiadene Prosecco Superiore DOCG Brut": {
        "profil": (
            "Elegante, extra brut, con note dominanti di mela verde, pera e"
            " fiori bianchi."
        ),
        "ideálne_k": "Frutti di mare, sushi, pesce bianco.",
        "teplota": "6-8 °C",
    },
    "Prosecco Millesimato Extra Dry": {
        "profil": (
            "Armonico, delicatamente fruttato con perlage persistente e"
            " fresco."
        ),
        "ideálne_k": "Aperitivo, antipasti, dolci alla frutta.",
        "teplota": "7-9 °C",
    },
    "Prosecco Rosé DOC Brut": {
        "profil": (
            "Fresco vino spumante rosato con note di lampone, ribes rosso e"
            " struttura elegante."
        ),
        "ideálne_k": "Insalate estive, pollame alla griglia, tapas.",
        "teplota": "8-10 °C",
    },
}

st.sidebar.title("🍷 M.I.A. Ecosystem")
st.sidebar.markdown("---")
app_mode = st.sidebar.radio(
    "Modalità:",
    [
        "Zona Clienti (Sommelier & Test 6s)",
        "Dashboard Manageriale (Dati per il Produttore)",
    ],
)

if app_mode == "Zona Clienti (Sommelier & Test 6s)":
  st.title("✦ Il tuo Sommelier Personale AI")
  st.markdown(
      "*Esperienza immersiva e on-premise per il cliente finale.*"
  )

  col1, col2 = st.columns([1, 1])

  with col1:
    st.subheader("1. Selezione & Scansione")
    selected_bottle = st.selectbox(
        "Prodotto selezionato dalla cantina:", list(WINE_DATABASE.keys())
    )

    bottle_info = WINE_DATABASE[selected_bottle]
    st.success(f"**Prodotto attivo:** {selected_bottle}")
    st.write(f"🧬 **Profilo:** {bottle_info['profil']}")
    st.write(f"🍽️ **Abbinamento ideale:** {bottle_info['ideálne_k']}")

    st.markdown("---")
    st.subheader("⭐ Test Sensoriale Rapido")
    st.write("Valutazione strutturata in 6 secondi:")

    telo = st.radio(
        "Corpo del vino?", ["Leggero 🍃", "Medio ⚖️", "Pieno 🍇"], horizontal=True
    )
    kyslost = st.radio(
        "Acidità?", ["Fresca ⚡", "Giusta 👌", "Bassa 🍯"], horizontal=True
    )
    vnem = st.radio(
        "Sensazione principale:",
        ["Fruttata 🍏", "Floreale 🌸", "Minerale 🪨"],
        horizontal=True,
    )

    if st.button("Invia feedback e colleziona punti 🚀"):
      st.success(
          "✨ Dati acquisiti con successo. Il profilo sensoriale è stato registrato"
          " nel sistema locale."
      )

  with col2:
    st.subheader("2. AI Sommelier (Live Chat)")
    st.write("Interazione contestuale con l'identità della cantina:")

    if "messages" not in st.session_state:
      st.session_state.messages = [{
          "role": "assistant",
          "content": (
              f"Benvenuti. Eccellente scelta il **{selected_bottle}**. Come"
              " posso assistervi oggi?"
          ),
      }]

    for message in st.session_state.messages:
      with st.chat_message(message["role"]):
        st.markdown(message["content"])

    if prompt := st.chat_input("Scrivi una richiesta..."):
      st.session_state.messages.append({"role": "user", "content": prompt})
      with st.chat_message("user"):
        st.markdown(prompt)

      ai_response = (
          f"In merito al vostro interesse per **{selected_bottle}**: Si"
          f" consiglia il servizio a {bottle_info['teplota']}. Armonizza"
          f" perfettamente con {bottle_info['ideálne_k']}."
      )

      st.session_state.messages.append(
          {"role": "assistant", "content": ai_response}
      )
      with st.chat_message("assistant"):
        st.markdown(ai_response)

else:
  st.title("✦ Dashboard Manageriale (Analytics On-Premise)")
  st.markdown(
      "Monitoraggio in tempo reale dei dati di consumo e dei profili"
      " sensoriali raccolti."
  )

  col1, col2, col3 = st.columns(3)
  col1.metric("Profili sensoriali", "1.428", "+14% questa settimana")
  col2.metric("Indice di gradimento", "91%", "Alta stabilità")
  col3.metric("Prodotto di punta", "Valdobbiadene DOCG", "58% del volume")

  st.markdown("---")
  st.subheader("📈 Mappa Sensoriale Dinamica")
  st.write(
      "Aggregazione sicura dei dati di mercato direttamente dai consumatori:"
  )

  chart_data = {"Fruttata 🍏": 54, "Floreale 🌸": 30, "Minerale 🪨": 16}
  st.bar_chart(chart_data)

  st.success(
      "🔒 **Infrastruttura on-premise isolata. Piena conformità GDPR e controllo"
      " totale dei dati aziendali.**"
  )
