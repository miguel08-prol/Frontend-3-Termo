import React from 'react';
import { motion } from 'framer-motion';
import { Backpack, User, Activity, Sparkles, Bell, ArrowRight,LayoutDashboard,CodeXml } from 'lucide-react';

// Variantes de animação para os contêineres (efeito cascata/stagger)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Variantes para os itens individuais subirem suavemente
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 font-sans overflow-hidden">
      
      {/* Efeitos de luz de fundo */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        className="w-full max-w-5xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Cabeçalho (Hero) */}
        <motion.header 
          variants={itemVariants}
          className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6 backdrop-blur-md cursor-default"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <Sparkles size={16} className="text-blue-400" />
              <span>Dashboard Interativo</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent mb-3 tracking-tight">
              Olá, Mundo!
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              Bem-vindo ao seu novo painel de controle.
            </p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative backdrop-blur-md group"
          >
            <Bell size={20} className="text-gray-300 group-hover:text-white transition-colors" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0a0a0a]"></span>
          </motion.button>
        </motion.header>

        {/* Layout em Grid para os Cards */}
        <motion.main 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Saudacao />
          <Setor 
  nome="Desenvolvimento"
  notificacoes={8}
  tarefasUrgentes={3}
  corDestaque="text-blue-400 shadow-blue-500/20"
  membros={[
    "https://images.unsplash.com/photo-1774195348123-23811cf97f4d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1602992708529-c9fdb12905c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]}
/>
          <Perfil />
          <Painel />
          <Painel2 />
        </motion.main>
      </motion.div>
    </div>
  );
}

// Componente Card Reutilizável com efeitos Hover Premium
function Card({ title, children, icon: Icon, colorClass }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-white/15 to-white/5 overflow-hidden shadow-2xl shadow-black/50"
    >
      {/* Brilho interno que aparece no hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative h-full bg-[#111111] rounded-[23px] p-7 flex flex-col backdrop-blur-sm">
        
        {/* Ícone com cor dinâmica */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/5 shadow-inner ${colorClass}`}>
          <Icon size={26} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">{title}</h2>
        <div className="text-gray-400 flex-grow font-light text-sm md:text-base leading-relaxed">
          {children}
        </div>
        
        {/* Botão sutil de ação */}
        <motion.div 
          className="mt-8 flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-white transition-colors cursor-pointer w-fit"
        >
          Acessar <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Card 1: Saudação
function Saudacao() {
  return (
    <Card title="Saudação" icon={Backpack} colorClass="text-emerald-400 shadow-emerald-500/20">
      <p>Olá, aluno! Pronto para começar os estudos de hoje? Suas trilhas de aprendizado foram atualizadas.</p>
      
      {/* Barra de progresso animada */}
      <div className="mt-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-500">Progresso diário</span>
          <span className="text-emerald-400 font-medium">65%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </Card>
  );
}

// Card 2: Perfil
function Perfil() {
  return (
    <Card title="Perfil" icon={User} colorClass="text-blue-400 shadow-blue-500/20">
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <span className="text-gray-500">Status</span>
          <span className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-emerald-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> 
            Online
          </span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-gray-500">Nível Atual</span>
          <span className="text-white font-medium bg-white/5 px-3 py-1 rounded-lg text-sm border border-white/5">
            Desenvolvedor Jr.
          </span>
        </div>
      </div>
    </Card>
  );
}

// Card 3: Painel/Atividades
function Painel() {
  return (
    <Card title="Painel" icon={Activity} colorClass="text-purple-400 shadow-purple-500/20">
      <p className="mb-6">Você tem <strong className="text-white font-semibold">5</strong> novas notificações e <strong className="text-white font-semibold">2</strong> tarefas urgentes pendentes hoje.</p>
      
      {/* Avatares/Membros sobrepostos */}
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          {[
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
          ].map((src, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="w-10 h-10 rounded-full border-2 border-[#111] bg-gray-800 overflow-hidden relative z-10 hover:z-20 cursor-pointer"
            >
              <img src={src} alt={`User ${i}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-[#111] bg-white/5 flex items-center justify-center text-xs font-medium text-gray-400 relative z-0">
            +2
          </div>
        </div>
      </div>
    </Card>
  );
}

// Card 4: 
function Setor({ nome, notificacoes, tarefasUrgentes, membros, corDestaque = "text-purple-400 shadow-purple-500/20" }) {
  return (
    <Card title={nome} icon={CodeXml} colorClass={corDestaque}>
      <p className="mb-6">
        Você tem <strong className="text-white font-semibold">{notificacoes}</strong> novas notificações e 
        <strong className="text-white font-semibold"> {tarefasUrgentes}</strong> tarefas urgentes pendentes hoje.
      </p>
      
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          {membros.slice(0, 3).map((src, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="w-10 h-10 rounded-full border-2 border-[#111] bg-gray-800 overflow-hidden relative z-10 hover:z-20 cursor-pointer"
            >
              <img src={src} alt={`Membro ${i}`} className="w-full h-full object-cover" />
            </motion.div>
          ))}
          
          {/* Mostra o contador se houver mais de 3 membros */}
          {membros.length > 3 && (
            <div className="w-10 h-10 rounded-full border-2 border-[#111] bg-white/5 flex items-center justify-center text-xs font-medium text-gray-400 relative z-0">
              +{membros.length - 3}
            </div>
          )}
        </div>
      </div>
    </Card>  
  );
}

// Card 5: 
function Painel2() {
  const [texto, setTexto] = React.useState(""); 

  return (
    <Card title="Painel2" icon={LayoutDashboard} colorClass="text-purple-400 shadow-purple-500/20">
      <div className="space-y-4">
        <p className="text-gray-400">
          Escreva uma <strong className="text-white font-semibold">Mensagem</strong> para a equipe.
        </p>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Digite algo..."
            onChange={(e) => setTexto(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            maxLength={25}
          />
        </div>

        <div className="pt-2">
          <p className="text-sm text-gray-400">
            O que você digitou: 
            <span className="ml-2 text-purple-400 font-medium">
              {texto}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}