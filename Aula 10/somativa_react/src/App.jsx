import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState("Palestra");
  const [eventVagas, setEventVagas] = useState("30");
  const [eventList, setEventList] = useState([]);
  const [activeTab, setActiveTab] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Função para mostrar toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Carregar dados iniciais do LocalStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("@eventpulse_data");
    if (savedEvents) {
      setEventList(JSON.parse(savedEvents));
    }
  }, []);

  // Sincronizar alterações com o LocalStorage
  useEffect(() => {
    localStorage.setItem("@eventpulse_data", JSON.stringify(eventList));
  }, [eventList]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showToast('Por favor, insira o nome do evento!', 'error');
      return;
    }

    const newEvent = {
      id: crypto.randomUUID(),
      title: eventTitle,
      type: eventType,
      status: "Agendado",
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR'),
      vagas: parseInt(eventVagas),
      inscritos: 0,
      participantes: []
    };

    setEventList([newEvent, ...eventList]);
    setEventTitle("");
    showToast(`Evento "${eventTitle}" criado com sucesso!`, 'success');
  };

  const toggleStatus = (id) => {
    setEventList(eventList.map(evt => {
      if (evt.id === id) {
        let nextStatus;
        if (evt.status === "Agendado") nextStatus = "Em Andamento";
        else if (evt.status === "Em Andamento") nextStatus = "Encerrado";
        else nextStatus = "Agendado";
        
        showToast(`Status alterado para ${nextStatus}`, 'info');
        return { ...evt, status: nextStatus };
      }
      return evt;
    }));
  };

  const deleteEvent = (id) => {
    const event = eventList.find(evt => evt.id === id);
    if (event) {
      setEventList(eventList.filter(evt => evt.id !== id));
      showToast(`Evento "${event.title}" removido!`, 'warning');
    }
  };

  const inscreverAluno = (id) => {
    const event = eventList.find(evt => evt.id === id);
    if (event && event.vagas > 0) {
      const alunoNome = prompt("Digite o nome do aluno:", `Aluno ${event.inscritos + 1}`);
      if (alunoNome && alunoNome.trim()) {
        setEventList(eventList.map(evt => {
          if (evt.id === id) {
            return {
              ...evt,
              vagas: evt.vagas - 1,
              inscritos: evt.inscritos + 1,
              participantes: [...evt.participantes, { nome: alunoNome, data: new Date().toLocaleString() }]
            };
          }
          return evt;
        }));
        showToast(`${alunoNome} inscrito em "${event.title}"!`, 'success');
      }
    } else if (event && event.vagas === 0) {
      showToast('Vagas esgotadas para este evento!', 'error');
    }
  };

  const limparCronograma = () => {
    if (eventList.length === 0) {
      showToast('Nenhum evento para limpar!', 'info');
      return;
    }
    
    if (window.confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os eventos permanentemente. Continuar?')) {
      setEventList([]);
      localStorage.removeItem("@eventpulse_data");
      showToast('Todos os eventos foram removidos!', 'error');
    }
  };

  // Estatísticas
  const getStats = () => {
    const total = eventList.length;
    const palestras = eventList.filter(e => e.type === "Palestra").length;
    const workshops = eventList.filter(e => e.type === "Workshop").length;
    const paineis = eventList.filter(e => e.type === "Painel").length;
    const emAndamento = eventList.filter(e => e.status === "Em Andamento").length;
    const agendados = eventList.filter(e => e.status === "Agendado").length;
    const encerrados = eventList.filter(e => e.status === "Encerrado").length;
    const totalVagas = eventList.reduce((acc, e) => acc + (e.vagas + e.inscritos), 0);
    const totalInscritos = eventList.reduce((acc, e) => acc + e.inscritos, 0);
    const ocupacao = totalVagas > 0 ? Math.round((totalInscritos / totalVagas) * 100) : 0;
    
    return { total, palestras, workshops, paineis, emAndamento, agendados, encerrados, totalVagas, totalInscritos, ocupacao };
  };

  const stats = getStats();

  // Filtros combinados
  const getFilteredEvents = () => {
    let filtered = [...eventList];

    if (activeTab === "andamento") {
      filtered = filtered.filter(evt => evt.status === "Em Andamento");
    } else if (activeTab === "agendados") {
      filtered = filtered.filter(evt => evt.status === "Agendado");
    } else if (activeTab === "encerrados") {
      filtered = filtered.filter(evt => evt.status === "Encerrado");
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(evt =>
        evt.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Ordenação: Workshops sempre no início
  const sortEventsByWorkshopPriority = (events) => {
    const workshops = events.filter(evt => evt.type === "Workshop");
    const outros = events.filter(evt => evt.type !== "Workshop");
    return [...workshops, ...outros];
  };

  const filteredEvents = sortEventsByWorkshopPriority(getFilteredEvents());

  const getVagasStatus = (vagas, total) => {
    if (vagas === 0) return { text: "Esgotado", disabled: true, color: "#ef4444", icon: "🔴" };
    if (vagas <= 5) return { text: `Últimas ${vagas} vagas!`, disabled: false, color: "#f59e0b", icon: "⚠️" };
    return { text: `${vagas} vagas`, disabled: false, color: "#10b981", icon: "✅" };
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Agendado": return "#3b82f6";
      case "Em Andamento": return "#f59e0b";
      case "Encerrado": return "#6b7280";
      default: return "#8b5cf6";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Agendado": return "📅";
      case "Em Andamento": return "⚡";
      case "Encerrado": return "✅";
      default: return "📌";
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "Palestra": return "🎤";
      case "Workshop": return "🔧";
      case "Painel": return "👥";
      default: return "📌";
    }
  };

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">EventPulse</span>
          </div>
          <p className="logo-subtitle">Academic Management</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4>Menu Principal</h4>
            <button className={`nav-item ${activeTab === "todos" ? "active" : ""}`} onClick={() => setActiveTab("todos")}>
              <span className="nav-icon">📊</span>
              <span>Todos Eventos</span>
              <span className="nav-badge">{stats.total}</span>
            </button>
            <button className={`nav-item ${activeTab === "andamento" ? "active" : ""}`} onClick={() => setActiveTab("andamento")}>
              <span className="nav-icon">⚡</span>
              <span>Em Andamento</span>
              <span className="nav-badge">{stats.emAndamento}</span>
            </button>
            <button className={`nav-item ${activeTab === "agendados" ? "active" : ""}`} onClick={() => setActiveTab("agendados")}>
              <span className="nav-icon">📅</span>
              <span>Agendados</span>
              <span className="nav-badge">{stats.agendados}</span>
            </button>
            <button className={`nav-item ${activeTab === "encerrados" ? "active" : ""}`} onClick={() => setActiveTab("encerrados")}>
              <span className="nav-icon">✅</span>
              <span>Encerrados</span>
              <span className="nav-badge">{stats.encerrados}</span>
            </button>
          </div>

          <div className="nav-section">
            <h4>Visualização</h4>
            <button className="nav-item" onClick={() => setShowStats(!showStats)}>
              <span className="nav-icon">📈</span>
              <span>{showStats ? 'Ocultar' : 'Mostrar'} Estatísticas</span>
            </button>
            <button className="nav-item" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              <span className="nav-icon">{viewMode === "grid" ? "📋" : "📱"}</span>
              <span>Modo {viewMode === "grid" ? "Lista" : "Grid"}</span>
            </button>
          </div>

          <div className="nav-section">
            <h4>Configurações</h4>
            <button className="nav-item" onClick={limparCronograma}>
              <span className="nav-icon">🗑️</span>
              <span>Limpar Todos</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot"></span>
            <span>Sistema Online</span>
          </div>
          <small>v2.0.0</small>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard de Eventos</h1>
            <p>Gerencie seus eventos acadêmicos de forma profissional</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>✕</button>
              )}
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        {showStats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📌</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Eventos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎤</div>
              <div className="stat-info">
                <h3>{stats.palestras}</h3>
                <p>Palestras</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔧</div>
              <div className="stat-info">
                <h3>{stats.workshops}</h3>
                <p>Workshops</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.paineis}</h3>
                <p>Painéis</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🎓</div>
              <div className="stat-info">
                <h3>{stats.totalInscritos}</h3>
                <p>Inscritos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💺</div>
              <div className="stat-info">
                <h3>{stats.totalVagas}</h3>
                <p>Vagas Totais</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{stats.ocupacao}%</h3>
                <p>Ocupação</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="form-card">
          <h2>📝 Criar Novo Evento</h2>
          <form onSubmit={addEvent}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nome do evento..."
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                  <option value="Palestra">🎤 Palestra</option>
                  <option value="Workshop">🔧 Workshop</option>
                  <option value="Painel">👥 Painel</option>
                </select>
              </div>
              <div className="form-group">
                <select value={eventVagas} onChange={(e) => setEventVagas(e.target.value)}>
                  <option value="10">10 vagas</option>
                  <option value="30">30 vagas</option>
                  <option value="50">50 vagas</option>
                  <option value="100">100 vagas</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">
                + Criar Evento
              </button>
            </div>
          </form>
        </div>

        {/* Events Section */}
        <div className="events-section">
          <div className="section-header">
            <h2>
              {activeTab === "todos" && "📋 Todos os Eventos"}
              {activeTab === "andamento" && "⚡ Eventos em Andamento"}
              {activeTab === "agendados" && "📅 Eventos Agendados"}
              {activeTab === "encerrados" && "✅ Eventos Encerrados"}
              {searchTerm && ` - Buscando: "${searchTerm}"`}
            </h2>
            <span className="events-count">{filteredEvents.length} eventos</span>
          </div>

          <div className={`events-${viewMode}`}>
            {filteredEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Nenhum evento encontrado</h3>
                <p>Comece criando seu primeiro evento acadêmico</p>
              </div>
            ) : (
              filteredEvents.map(item => {
                const totalVagasOriginais = item.vagas + item.inscritos;
                const vagasInfo = getVagasStatus(item.vagas, totalVagasOriginais);
                const statusColor = getStatusColor(item.status);
                return (
                  <div key={item.id} className={`event-item ${item.type.toLowerCase()}`}>
                    <div className="event-status-indicator" style={{ backgroundColor: statusColor }}></div>
                    
                    <div className="event-main">
                      <div className="event-header">
                        <h3>
                          {getTypeIcon(item.type)} {item.title}
                          {item.type === "Workshop" && <span className="workshop-badge">⭐ Workshop Destacado</span>}
                        </h3>
                        <div className="event-meta">
                          <span className="meta-item">📅 {item.date}</span>
                          <span className="meta-item">⏰ {item.time}</span>
                        </div>
                      </div>

                      <div className="event-details">
                        <div className="detail-badge">
                          <span className="label">Tipo:</span>
                          <span className={`value type-${item.type.toLowerCase()}`}>{item.type}</span>
                        </div>
                        <div className="detail-badge">
                          <span className="label">Status:</span>
                          <span className="value" style={{ color: statusColor }}>
                            {getStatusIcon(item.status)} {item.status}
                          </span>
                        </div>
                        <div className="detail-badge">
                          <span className="label">Inscritos:</span>
                          <span className="value">{item.inscritos}</span>
                        </div>
                      </div>

                      <div className="vagas-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${(item.inscritos / totalVagasOriginais) * 100}%`,
                              backgroundColor: vagasInfo.color
                            }}
                          ></div>
                        </div>
                        <div className="vagas-stats">
                          <span>🎓 Ocupação: {Math.round((item.inscritos / totalVagasOriginais) * 100)}%</span>
                          <span style={{ color: vagasInfo.color }}>{vagasInfo.icon} {vagasInfo.text}</span>
                        </div>
                      </div>

                      {item.participantes && item.participantes.length > 0 && (
                        <div className="participants-preview">
                          <span>👥 Último inscrito: {item.participantes[item.participantes.length - 1].nome}</span>
                        </div>
                      )}
                    </div>

                    <div className="event-actions">
                      <button 
                        onClick={() => inscreverAluno(item.id)} 
                        className="action-btn inscrever"
                        disabled={vagasInfo.disabled}
                      >
                        {vagasInfo.disabled ? "🔴 Esgotado" : "✅ Inscrever Aluno"}
                      </button>
                      <button 
                        onClick={() => toggleStatus(item.id)} 
                        className="action-btn status"
                      >
                        {item.status === "Agendado" && "▶️ Iniciar"}
                        {item.status === "Em Andamento" && "⏹️ Encerrar"}
                        {item.status === "Encerrado" && "🔄 Reabrir"}
                      </button>
                      <button 
                        onClick={() => deleteEvent(item.id)} 
                        className="action-btn delete"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* FAB Button */}
      <button className="info-fab" onClick={() => setShowModal(true)}>
        <span className="fab-icon">✨</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🎨 EventPulse - Features</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <h3>Recursos Implementados:</h3>
              <ul>
                <li>✅ <strong>Dashboard Profissional</strong> - Layout moderno com sidebar</li>
                <li>✅ <strong>CRUD Completo</strong> - Criar, ler, atualizar e deletar eventos</li>
                <li>✅ <strong>Sistema de Abas</strong> - Filtros por status (Agendado/Andamento/Encerrado)</li>
                <li>✅ <strong>Busca em Tempo Real</strong> - Filtro instantâneo por título</li>
                <li>✅ <strong>Workshops em Destaque</strong> - Sempre no topo da lista</li>
                <li>✅ <strong>Sistema de Vagas</strong> - Controle de inscrições com progresso visual</li>
                <li>✅ <strong>Toast Notifications</strong> - Feedback visual sem alerts</li>
                <li>✅ <strong>Persistência localStorage</strong> - Dados salvos automaticamente</li>
                <li>✅ <strong>Estatísticas em Tempo Real</strong> - Cards com métricas atualizadas</li>
                <li>✅ <strong>Design Responsivo</strong> - Adaptável a todos dispositivos</li>
                <li>✅ <strong>Visualização Grid/Lista</strong> - Duas formas de exibir eventos</li>
                <li>✅ <strong>Animações Suaves</strong> - Transições e feedback visual</li>
              </ul>
              <div className="modal-footer">
                <p>✨ Sistema completo para gestão de eventos acadêmicos!</p>
                <small>Versão 2.0 - Desenvolvido com React</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;