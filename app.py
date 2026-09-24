import streamlit as st

st.set_page_config(
    page_title="AI Sommelier | Live PoC",
    layout="wide",
    initial_sidebar_state="expanded",
)

# REÁLNA DATABÁZA PRODUKTOV (v taliančine pre maximálny šmrnc)
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

st.sidebar.title("🍷 Ecosystem AI per Cantina")
st.sidebar.markdown("---")
app_mode = st.sidebar.radio(
    "Modalità:",
    [
        "Zona Clienti (Sommelier & Test 6s)",
        "Dashboard Manageriale (Dati per il Produttore)",
    ],
)

if app_mode == "Zona Clienti (Sommelier & Test 6s)":
  st.title("🍇 Il tuo Sommelier Personale AI")
  st.markdown(
      "*Esperienza interattiva per il cliente tramite QR code o in cantina.*"
  )

  col1, col2 = st.columns([1, 1])

  with col1:
    st.subheader("1. Selezione Bottiglia / Scansione")
    selected_bottle = st.selectbox(
        "Prodotto selezionato dalla cantina:", list(WINE_DATABASE.keys())
    )

    bottle_info = WINE_DATABASE[selected_bottle]
    st.success(f"**Prodotto attivo:** {selected_bottle}")
    st.write(f"🧬 **Profilo:** {bottle_info['profil']}")
    st.write(f"🍽️ **Abbinamento ideale:** {bottle_info['ideálne_k']}")

    st.markdown("---")
    st.subheader("⭐ Test Sensoriale 6 Secondi (Punti fedeltà)")
    st.write("Valuta il vino con un solo click (niente recensioni noiose):")

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

    if st.button("Invia e guadagna 50 punti 🚀"):
      st.success(
          "🎉 Registrato! Il cliente ha guadagnato 50 punti e tu hai dati"
          " preziosi."
      )

  with col2:
    st.subheader("2. Chat dal vivo con l'AI Sommelier")
    st.write("Chiedi al sommelier (es. 'Si abbina al pesce?'):")

    if "messages" not in st.session_state:
      st.session_state.messages = [{
          "role": "assistant",
          "content": (
              f"Buongiorno! Ottima scelta il **{selected_bottle}**. Come posso"
              " aiutarvi oggi?"
          ),
      }]

    for message in st.session_state.messages:
      with st.chat_message(message["role"]):
        st.markdown(message["content"])

    if prompt := st.chat_input("Scrivi una domanda al sommelier..."):
      st.session_state.messages.append({"role": "user", "content": prompt})
      with st.chat_message("user"):
        st.markdown(prompt)

      ai_response = (
          f"Riguardo alla tua domanda su **{selected_bottle}**: Consigliamo di"
          f" servire a una temperatura di {bottle_info['teplota']}. Si"
          f" abbina perfettamente a {bottle_info['ideálne_k']}."
      )

      st.session_state.messages.append(
          {"role": "assistant", "content": ai_response}
      )
      with st.chat_message("assistant"):
        st.markdown(ai_response)

else:
  st.title("📊 Dashboard Manageriale (Dati nascosti per la cantina)")
  st.markdown(
      "Qui il produttore vede i dati immediati dai test di 6 secondi –"
      " feedback sensoriale reale in tempo reale."
  )

  col1, col2, col3 = st.columns(3)
  col1.metric("Profili sensoriali raccolti", "1.428", "Test rapidi 6s")
  col2.metric("Freschezza percepita media", "91%", "Alta corrispondenza")
  col3.metric("Prodotto più richiesto", "Valdobbiadene DOCG", "58% delle richieste")

  st.markdown("---")
  st.subheader("📈 Mappa Sensoriale del Mercato (Dati diretti dai consumatori)")
  st.write(
      "Dati precisi su come il mercato percepisce i vostri lotti di prosecco:"
  )

  chart_data = {"Fruttata 🍏": 54, "Floreale 🌸": 30, "Minerale 🪨": 16}
  st.bar_chart(chart_data)

  st.success(
      "🔒 **Tutti i dati sono archiviati localmente in cantina, pienamente"
      " conformi al GDPR e senza terze parti.**"
  )