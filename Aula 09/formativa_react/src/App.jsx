import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Baixa");
  const [taskList, setTaskList] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  
  const [modal, setModal] = useState({ open: false, id: null });

  useEffect(() => {
    const saved = localStorage.getItem("@taskflow_premium");
    if (saved) setTaskList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("@taskflow_premium", JSON.stringify(taskList));
  }, [taskList]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    const newTask = {
      id: crypto.randomUUID(),
      text: taskText,
      priority,
      completed: false,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };
    setTaskList([newTask, ...taskList]);
    setTaskText("");
  };

  const confirmDelete = () => {
    setTaskList(taskList.filter(t => t.id !== modal.id));
    setModal({ open: false, id: null });
  };

  const filteredTasks = taskList
    .filter(t => {
      const matchesFilter = filter === "Todas" || (filter === "Pendentes" ? !t.completed : t.completed);
      const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const p = { "Alta": 3, "Média": 2, "Baixa": 1 };
      return p[b.priority] - p[a.priority];
    });

  return (
    <div className="modern-app">
      <nav className="navbar">
        <div className="nav-content">
          <div className="brand">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1>TaskFlow</h1>
          </div>
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              placeholder="Buscar tarefas..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <main className="container">
        <header className="page-header">
          <div className="header-text">
            <h2>Minhas Tarefas</h2>
            <p>Mantenha o foco e gerencie suas prioridades.</p>
          </div>
          <div className="filter-pills">
            {["Todas", "Pendentes", "Concluídas"].map(f => (
              <button 
                key={f} 
                className={filter === f ? "pill active" : "pill"}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <section className="input-card">
          <form onSubmit={addTask}>
            <div className="input-wrapper">
              <input 
                value={taskText} 
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="O que precisa ser feito?"
              />
            </div>
            <div className="controls-wrapper">
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Baixa">🟢 Baixa</option>
                <option value="Média">🟡 Média</option>
                <option value="Alta">🔴 Alta</option>
              </select>
              <button type="submit" className="btn-add">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nova Tarefa
              </button>
            </div>
          </form>
        </section>

        <div className="task-list">
          {filteredTasks.length === 0 && (
            <div className="empty-state">Nenhuma tarefa encontrada. 🎉</div>
          )}
          
          {filteredTasks.map(task => (
            <div key={task.id} className={`task-item ${task.priority.toLowerCase().replace('é', 'e')} ${task.completed ? 'is-done' : ''}`}>
              <div className="task-info">
                <button 
                  className="check-circle" 
                  onClick={() => setTaskList(taskList.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                
                <div className="text-group">
                  {editingId === task.id ? (
                    <input 
                      className="edit-field"
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => {
                        setTaskList(taskList.map(t => t.id === task.id ? {...t, text: editText} : t));
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.target.blur();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="task-text" onDoubleClick={() => {setEditingId(task.id); setEditText(task.text);}}>
                      {task.text}
                    </span>
                  )}
                  <div className="meta">
                    <span className="badge">{task.priority}</span>
                    <span className="date">{task.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="task-ops">
                <button className="btn-icon edit" onClick={() => {setEditingId(task.id); setEditText(task.text);}} title="Editar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="btn-icon delete" onClick={() => setModal({ open: true, id: task.id })} title="Excluir">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal.open && (
        <div className="overlay" onClick={() => setModal({ open: false, id: null })}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3>Excluir Tarefa</h3>
            <p>Esta ação não pode ser desfeita. Tem certeza que deseja remover esta tarefa permanentemente?</p>
            <div className="modal-footer">
              <button className="btn-sec" onClick={() => setModal({ open: false, id: null })}>Cancelar</button>
              <button className="btn-danger" onClick={confirmDelete}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;