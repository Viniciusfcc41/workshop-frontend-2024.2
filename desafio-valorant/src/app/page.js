"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState(null);

  useEffect(() => {
    async function fetchAgents() {
      const response = await fetch("https://valorant-api.com/v1/agents?language=pt-BR");
      const result = await response.json();
      const filteredData = filterAgents(result.data);
      setData(filteredData);
    }

    fetchAgents();
  }, []);

  async function fetchAgentByUUID(uuid) {
    const response = await fetch(`https://valorant-api.com/v1/agents/${uuid}?language=pt-BR`);
    const result = await response.json();
    setSelectedAgent(result.data);
  }

  function filterAgents(agents) {
    const uniqueAgents = {};
    agents.forEach(agent => {
      if (agent.displayName === "Sova") {
        if (uniqueAgents["Sova"] && uniqueAgents["Sova"].isPlayableCharacter === false && agent.isPlayableCharacter === true) {
          uniqueAgents["Sova"] = agent;
        } else if (!uniqueAgents["Sova"]) {
          uniqueAgents["Sova"] = agent;
        }
      } else {
        uniqueAgents[agent.uuid] = agent;
      }
    });
    return Object.values(uniqueAgents);
  }

  function handleAgentClick(agent) {
    fetchAgentByUUID(agent.uuid);
    setShowPopup(true);
  }

  function handleClosePopup() {
    setShowPopup(false);
    setSelectedAbility(null);
  }

  function handleAbilityClick(ability) {
    setSelectedAbility(ability);
  }

  return (
    <main className={styles.background}>
      <nav className={styles.navContainer}>
        <input type="text" placeholder="Insira o nome de um agente " onChange={(e) => setSearch(e.target.value)} />
      </nav>

      <div className={styles.agentsList}>
        <h1>AGENTES</h1>
        <div className={styles.agentsContainer}>
          {data.filter((item) => item.displayName.toLowerCase().includes(search.toLowerCase())).map((item) => (
            <div className={styles.agentCard} key={item.uuid} onClick={() => handleAgentClick(item)}>
              <h2>{item.displayName}</h2>
              <img src={item.displayIcon} className={styles.agentIcon} />
              <div className={styles.agentRole}>
                <p>{item.role.displayName}</p>
                <img src={item.role.displayIcon} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && selectedAgent && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <div className={styles.popupHeader}>
              <div className={styles.agentTitle}>
              <h2>{selectedAgent.displayName} ({selectedAgent.role.displayName})</h2>
              </div>
              <button onClick={handleClosePopup}>X</button>
            </div>
            <div className={styles.popupMain}>
              <div className={styles.popupPortrait}>
                <img src={selectedAgent.fullPortrait} className={styles.agentFullPortrait} />
                <img src={selectedAgent.background} className={styles.agentFullBackground} />
              </div>
              <div className={styles.agentDetails}>
                <div className={styles.descriptionContainer}>
                  <h3>DESCRIÇÃO:</h3>
                  <p>{selectedAgent.description}</p>
                </div>
                <div className={styles.abilitiesContainer}>
                  <h3>ABILIDADES</h3>
                  <div className={styles.abilitiesIcons}>
                    {selectedAgent.abilities.map((ability, index) => ability.displayIcon && (
                      <img
                        key={index}
                        src={ability.displayIcon}
                        onClick={() => handleAbilityClick(ability)}
                        className={styles.abilityIcon}
                      />
                    ))}
                  </div>
                  <div className={styles.abilitiesDescription}>
                    {selectedAbility && (
                      <>
                        <h4>{selectedAbility.displayName}</h4>
                        <p>{selectedAbility.description}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}