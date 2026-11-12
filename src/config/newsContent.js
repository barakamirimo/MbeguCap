export const NEWS_STORAGE_KEY = 'mbegu_news_articles';

export const INITIAL_NEWS_ARTICLES = [
  {
    id: 'news_1',
    badge: 'Pilote MVP v0.1',
    badgeColor: '#0891B2',
    badgeBg: '#F0FDFA',
    title: 'Lancement du Pilote Privé auprès des premiers commerçants à Kinshasa et Goma',
    date: '12 Octobre 2026',
    readTime: '3 min de lecture',
    excerpt: 'Les 30 premiers commerçants et épargnants pionniers testent la plateforme pour unifier caisse physique, Mobile Money (M-Pesa, Orange, Airtel) et devises CDF/USD.',
    content: `Nous sommes fiers d'annoncer le déploiement officiel de la version Pilote v0.1 de MBEGU Capital. 

Sélectionnés parmi les commerçants de Kinshasa (Gombe, Victoire) et de Goma (Nord-Kivu), ce groupe pilote valide quotidiennement les fonctionnalités clés :
- Ouverture et clôture de caisse avec détection automatique des écarts.
- Suivi rigoureux des créances clients avec rappels par WhatsApp.
- Conversion instantanée au taux officiel du jour (1 USD = 2 800 CDF).
- Stockage 100% sécurisé sur le terminal sans dépendance au cloud continu.`
  },
  {
    id: 'news_2',
    badge: 'Technologie & Résilience',
    badgeColor: '#10B981',
    badgeBg: '#ECFDF5',
    title: "Validation de l'Architecture 100% Hors-Ligne (Offline-First)",
    date: '28 Septembre 2026',
    readTime: '4 min de lecture',
    excerpt: "Les tests en conditions réelles confirment que toutes les opérations (ventes, encaissements, calculs d'intérêts) s'exécutent de façon fluide même en cas de coupure réseau prolongée.",
    content: `En République Démocratique du Congo, l'accès à une connexion Internet stable ne doit pas être un prérequis pour gérer son commerce.

Notre moteur local SQLite / WebStorage avec chiffrement AES-256 garantit :
- Zéro temps d'attente lors de la saisie d'un paiement ou d'une dépense.
- Synchronisation différentielle en tâche de fond dès que la connexion 4G ou Wi-Fi réapparaît.
- Protection stricte de vos livres de comptes contre les pertes de données.`
  },
  {
    id: 'news_3',
    badge: 'Module Commerçants',
    badgeColor: '#6366F1',
    badgeBg: '#EEF2FF',
    title: 'Gestion des créances clients : relancez vos débiteurs en un clic via WhatsApp',
    date: '15 Septembre 2026',
    readTime: '2 min de lecture',
    excerpt: 'Fini les disputes sur les dettes oubliées. La génération automatique du relevé de compte client permet des relances courtoises et précises en CDF et USD.',
    content: `La mauvaise gestion des ventes à crédit est la première cause de faillite des petites boutiques en Afrique Centrale.

Avec MBEGU Capital :
- Chaque vente à crédit est horodatée avec le nom du client et son numéro WhatsApp.
- Un bouton direct génère un message cordial rappelant l'échéance et le solde exact.
- Possibilité d'enregistrer des acomptes échelonnés avec reçu numérique.`
  }
];

export function getNewsArticles() {
  if (typeof window === 'undefined') return INITIAL_NEWS_ARTICLES;
  try {
    const raw = localStorage.getItem(NEWS_STORAGE_KEY);
    if (!raw) return INITIAL_NEWS_ARTICLES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return INITIAL_NEWS_ARTICLES;
  } catch {
    return INITIAL_NEWS_ARTICLES;
  }
}

export function saveNewsArticles(articles) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(articles));
    window.dispatchEvent(new CustomEvent('mbegu:news-change', { detail: { articles } }));
  } catch (e) {
    console.error(e);
  }
}

