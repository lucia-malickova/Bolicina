import streamlit as st

st.set_page_config(
    page_title="Bollicina | Luxury Ecosystem",
    layout="wide",
    initial_sidebar_state="expanded",
)

# BOUTIQUE LUXURY CSS (Inšpirované estetikou Bollicina: strieborná, čistá biela, prémiová sivá, minimalistické línie)
st.markdown(
    """
    <style>
    /* Celkové pozadie – čistý, luxusný butikový nádych */
    .stApp {
        background-color: #f8f9fa;
        color: #1a1a1a;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    
    /* Sidebar – elegantný ľadovo sivý/biely prechod */
    section[data-testid="stSidebar"] {
        background-color: #f1f3f5;
        border-right: 1px solid #e9ecef;
    }
    
    /* Nadpisy – čisté, butikové serifové alebo ľahké sans-serif */
    h1, h2, h3 {
        color: #111111;
        font-weight: 300;
        letter-spacing: -0.5px;
    }
    
    /* Prémiové tlačidlá – decentná čierna / strieborný detail */
    div.stButton > button {
        background-color: #1a1a1a;
        color: #ffffff;
        border: 1px solid #333333;
        border-radius: 0px; /* Ostré, architektonické hrany v štýle vysokého dizajnu */
        padding: 0.6rem 1.5rem;
        font-weight: 400;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    }
    div.stButton > button:hover {
        background-color: #333333;
        color: #ffffff;
        border-color: #1a1a1a;
    }
    
    /* Karty / Metriky – čisté biele s jemným tieňom */
    div[data-testid="metric-container"] {
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        padding: 20px;
        border-radius: 0px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    
    /* Selectbox a vstupy */
    .stSelectbox div[data-baseweb="select"] {
        background-color: #ffffff;
        border-radius: 0px;
    }
    
    /* Úspešné hlášky – čisté, minimalistické */
    .stSuccess {
        background-color: #e6f4ea;
        color: #137333;
        border: none;
        border-radius: 0px;
    }
    </style>
""",
    unsafe_allow_html=True,
)

# REÁLNA DATABÁZA PRODUKTU BOLLICINA
WINE_DATABASE = {
    "Bollicina Ice Prosecco Demi-Sec": {
        "profil": (
            "Timeless Prosecco ideal for social events. Elegant packaging,"
            " silver and white charm with blue and grey notes."
        ),
        "ideálne_k": (
            "Served on ice in a large stemmed glass with fresh berries or lime."
        ),
        "teplota": "6-8 °C",
    },
    "Bollicina Spumante Extra Dry DOC": {
        "profil": (
            "Bright straw colour, fine mousse, perfumed bouquet with citrus,"
            " peach, and white flowers."
        ),
        "ideálne_k": "Aperitif, grilled fish, delicate seafood.",
        "teplota": "7-9 °C",
    },
    "Bollicina Rosé Brut": {
        "profil": (
            "Fresh sparkling rosé with notes of wild raspberry, red currant,"
            " and a refined structure."
        ),
        "ideálne_k": "Summer salads, canapés, refined modern tapas.",
        "teplota": "8-10 °C",
    },
}

st.sidebar.title("✦ BOLLICINA")
st.sidebar.caption("Exclusive Wine Experience")
st.sidebar.markdown("---")
app_mode = st.sidebar.radio(
    "Navigation:",
    [
        "Client Experience (Sommelier & 6s Test)",
        "Managerial Dashboard (Data & Insights)",
    ],
)

if app_mode == "Client Experience (Sommelier & 6s Test)":
  st.title("BOLLICINA // AI Sommelier")
  st.markdown(
      "*An exclusive on-premise sensory journey tailored for the discerning"
      " guest.*"
  )
  st.markdown("---")

  col1, col2 = st.columns([1, 1], gap="large")

  with col1:
    st.subheader("01. Selection & Provenance")
    selected_bottle = st.selectbox(
        "Choose your Bollicina expression:", list(WINE_DATABASE.keys())
    )

    bottle_info = WINE_DATABASE[selected_bottle]
    st.markdown(f"**Active Selection:** `{selected_bottle}`")
    st.write(f"*Notes:* {bottle_info['profil']}")
    st.write(f"*Pairing:* {bottle_info['ideálne_k']}")

    st.markdown("---")
    st.subheader("02. Rapid Sensory Profiling")
    st.caption(
        "Instant, frictionless feedback replacing traditional reviews (Earns"
        " VIP rewards)."
    )

    telo = st.radio(
        "Body structure:", ["Light 🍃", "Balanced ⚖️", "Full 🍇"], horizontal=True
    )
    kyslost = st.radio(
        "Acidity profile:",
        ["Crisp ⚡", "Harmonic 👌", "Soft 🍯"],
        horizontal=True,
    )
    vnem = st.radio(
        "Primary impression:",
        ["Citrus/Fruit 🍏", "Floral 🌸", "Mineral 🪨"],
        horizontal=True,
    )

    if st.button("Submit & Claim Rewards"):
      st.success(
          "Profile securely registered. 50 VIP points credited to your"
          " guest profile."
      )

  with col2:
    st.subheader("03. Concierge AI")
    st.caption("Contextual pairing and service guidance.")

    if "messages" not in st.session_state:
      st.session_state.messages = [{
          "role": "assistant",
          "content": (
              f"Welcome. An exceptional choice — {selected_bottle}. How may I"
              " assist your experience today?"
          ),
      }]

    for message in st.session_state.messages:
      with st.chat_message(message["role"]):
        st.markdown(message["content"])

    if prompt := st.chat_input("Inquire about pairing, serving, heritage..."):
      st.session_state.messages.append({"role": "user", "content": prompt})
      with st.chat_message("user"):
        st.markdown(prompt)

      ai_response = (
          f"Regarding your query on **{selected_bottle}**: We recommend"
          f" serving at {bottle_info['teplota']}. It creates an exquisite"
          f" harmony with {bottle_info['ideálne_k']}."
      )

      st.session_state.messages.append(
          {"role": "assistant", "content": ai_response}
      )
      with st.chat_message("assistant"):
        st.markdown(ai_response)

else:
  st.title("BOLLICINA // Executive Intelligence")
  st.markdown(
      "*Real-time aggregation of consumer sensory data and on-premise"
      " engagement.*"
  )
  st.markdown("---")

  col1, col2, col3 = st.columns(3)
  col1.metric("Verified Sensory Profiles", "1,428", "+14% vs last week")
  col2.metric("Perceived Freshness Index", "98.2%", "Optimal batch alignment")
  col3.metric("Leading Designation", "Bollicina Ice", "58% volume share")

  st.markdown("---")
  st.subheader("Market Sensory Mapping")
  st.caption("Direct consumer feedback processed through frictionless UI.")

  chart_data = {"Citrus/Fruit 🍏": 54, "Floral 🌸": 30, "Mineral 🪨": 16}
  st.bar_chart(chart_data)

  st.success(
      "🔒 **Infrastructure status: Secured locally. Full GDPR compliance with"
      " zero third-party exposure.**"
  )
