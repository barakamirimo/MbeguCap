import { useState, useEffect, useMemo } from 'react';
import {
  IconShield,
  IconCheck,
  IconFileSpreadsheet,
  IconFileText,
  IconCoins,
  IconWhatsApp,
  IconSmartphone,
  IconUsers,
  IconLock,
  IconUserPlus,
  IconTrash2,
  IconEye,
  IconEyeOff,
  IconEdit,
  IconNewspaper,
  IconMapPin
} from './Icons';
import { getSiteContent, SITE_CONTENT_KEY } from '../config/siteContent';
import { getNewsArticles, saveNewsArticles } from '../config/newsContent';
import { translations } from '../data/translations';

const ADMIN_STORAGE_KEY = 'mbegu_admin_session';
const SUB_ADMINS_STORAGE_KEY = 'mbegu_sub_admins';
const SUPER_ADMIN_STORAGE_KEY = 'mbegu_superadmin_credentials';
const DEFAULT_SUPER_ADMIN_USERNAME = 'MbeguCapital243';
const DEFAULT_SUPER_ADMIN_PASSWORD = 'chelumia@003';

const INITIAL_DEMO_PILOTS = [
  { id: 'pilot_1', fullName: 'Patrick Mwamba', phone: '+243 99 876 5432', email: 'patrick.mwamba@outlook.com', role: 'commercant', city: 'Lubumbashi', currencyPref: 'CDF_USD', status: 'validé', timestamp: '2026-11-01T10:15:00Z' },
  { id: 'pilot_2', fullName: 'Dr. Chantal Kalanga', phone: '+243 81 234 5678', email: 'chantal.kalanga@gmail.com', role: 'particulier', city: 'Kinshasa (Gombe)', currencyPref: 'CDF_USD', status: 'contacté', timestamp: '2026-11-02T14:30:00Z' },
  { id: 'pilot_3', fullName: 'Serge Bisimwa', phone: '+243 97 456 7890', email: 'serge.bisimwa@yahoo.fr', role: 'pme', city: 'Goma', currencyPref: 'USD', status: 'en attente', timestamp: '2026-11-03T09:00:00Z' }
];

export default function AdminDashboard({ onReturnToWebsite }) {
  // SuperAdmin persistent credentials
  const [superAdminCreds, setSuperAdminCreds] = useState(() => {
    try {
      const saved = localStorage.getItem(SUPER_ADMIN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username && parsed.password) {
          return {
            username: parsed.username,
            password: parsed.password,
            fullName: parsed.fullName || 'Super Administrateur Principal'
          };
        }
      }
    } catch {
      // ignore
    }
    return {
      username: DEFAULT_SUPER_ADMIN_USERNAME,
      password: DEFAULT_SUPER_ADMIN_PASSWORD,
      fullName: 'Super Administrateur Principal'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(SUPER_ADMIN_STORAGE_KEY, JSON.stringify(superAdminCreds));
    } catch (e) {
      console.error(e);
    }
  }, [superAdminCreds]);

  // Admin accounts managed by SuperAdmin
  const [subAdmins, setSubAdmins] = useState(() => {
    try {
      const saved = localStorage.getItem(SUB_ADMINS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Save subAdmins to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SUB_ADMINS_STORAGE_KEY, JSON.stringify(subAdmins));
    } catch (e) {
      console.error(e);
    }
  }, [subAdmins]);

  // Admin authentication state & session details
  const [adminSession, setAdminSession] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!saved) return null;
      if (saved === 'true') {
        let creds = { username: DEFAULT_SUPER_ADMIN_USERNAME, fullName: 'Super Administrateur Principal' };
        try {
          const savedCreds = localStorage.getItem(SUPER_ADMIN_STORAGE_KEY);
          if (savedCreds) {
            const parsed = JSON.parse(savedCreds);
            if (parsed && parsed.username) {
              creds = { username: parsed.username, fullName: parsed.fullName || 'Super Administrateur Principal' };
            }
          }
        } catch {
          // ignore
        }
        return {
          username: creds.username,
          fullName: creds.fullName,
          role: 'superadmin'
        };
      }
      const parsed = JSON.parse(saved);
      return (parsed && parsed.username) ? parsed : null;
    } catch {
      return null;
    }
  });

  const isAdminAuthenticated = Boolean(adminSession);
  const isSuperAdmin = adminSession?.role === 'superadmin';
  const isRestrictedAdmin = adminSession?.role === 'restricted';

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);

  // Active section tab: 'pilots' | 'news' | 'team' | 'content' | 'config' | 'admins'
  const [activeTab, setActiveTab] = useState('pilots');

  // Actualités (News articles) state - accessible to BOTH SuperAdmin and Restricted Admin
  const [articles, setArticles] = useState(getNewsArticles);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    badge: 'Pilote MVP v0.1',
    badgeColor: '#0891B2',
    badgeBg: '#F0FDFA',
    date: '',
    readTime: '3 min de lecture',
    excerpt: '',
    content: '',
    translations: {
      en: { title: '', badge: '', date: '', readTime: '', excerpt: '', content: '' },
      sw: { title: '', badge: '', date: '', readTime: '', excerpt: '', content: '' }
    }
  });

  useEffect(() => {
    const handleNewsChange = () => setArticles(getNewsArticles());
    window.addEventListener('mbegu:news-change', handleNewsChange);
    window.addEventListener('storage', handleNewsChange);
    return () => {
      window.removeEventListener('mbegu:news-change', handleNewsChange);
      window.removeEventListener('storage', handleNewsChange);
    };
  }, []);

  // New Sub-Admin Form (SuperAdmin only)
  const [newAdminFullName, setNewAdminFullName] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showCreateAdminPassword, setShowCreateAdminPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState({});

  const togglePasswordVisibility = (adminId) => {
    setRevealedPasswords(prev => ({ ...prev, [adminId]: !prev[adminId] }));
  };

  // SuperAdmin edit own credentials modal state
  const [showEditSuperAdminModal, setShowEditSuperAdminModal] = useState(false);
  const [superAdminEditForm, setSuperAdminEditForm] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showSuperAdminEditPassword, setShowSuperAdminEditPassword] = useState(false);
  const [showSuperAdminCurrentPassword, setShowSuperAdminCurrentPassword] = useState(false);

  // Sub-Admin edit credentials modal state (SuperAdmin only)
  const [showEditSubAdminModal, setShowEditSubAdminModal] = useState(false);
  const [editingSubAdminId, setEditingSubAdminId] = useState(null);
  const [subAdminEditForm, setSubAdminEditForm] = useState({
    fullName: '',
    username: '',
    password: ''
  });
  const [showSubAdminEditPassword, setShowSubAdminEditPassword] = useState(false);

  // Pilot candidates list
  const [pilots, setPilots] = useState(() => {
    try {
      const saved = localStorage.getItem('mbegu_pilot_signups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_DEMO_PILOTS;
    } catch {
      return INITIAL_DEMO_PILOTS;
    }
  });

  // Exchange rate config
  const [exchangeRate, setExchangeRate] = useState(() => {
    try {
      const saved = localStorage.getItem('@mbegu_capital_live_v1_rate');
      return saved ? Number(saved) : 2800;
    } catch {
      return 2800;
    }
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [siteContent, setSiteContent] = useState(getSiteContent);
  const [siteContentJson, setSiteContentJson] = useState(() => JSON.stringify(getSiteContent(), null, 2));
  const [jsonEditorTouched, setJsonEditorTouched] = useState(false);
  const [teamMembers, setTeamMembers] = useState(() => {
    const savedMembers = getSiteContent().teamMembers;
    const members = Array.isArray(savedMembers) ? savedMembers : translations.fr.teamSection.members;
    return members.map((member, index) => ({ ...member, id: member.id || `team_member_${index}` }));
  });
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState(null);
  const [teamMemberForm, setTeamMemberForm] = useState({
    name: '',
    role: '',
    bio: '',
    location: '',
    badge: '',
    photo: '',
    roleEn: '',
    roleSw: '',
    locationEn: '',
    locationSw: '',
    bioEn: '',
    bioSw: '',
    badgeEn: '',
    badgeSw: ''
  });

  // New Pilot Modal state
  const [showAddPilotModal, setShowAddPilotModal] = useState(false);
  const [newPilot, setNewPilot] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: 'commercant',
    city: 'Kinshasa',
    currencyPref: 'CDF_USD'
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mbegu_pilot_signups', JSON.stringify(pilots));
    } catch (e) {
      console.error(e);
    }
  }, [pilots]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenTeamMemberForm = (member = null) => {
    if (!isSuperAdmin) {
      showToast("Action refusée : La gestion de l'équipe est réservée au Super Admin.");
      return;
    }
    setEditingTeamMemberId(member?.id || null);
    const englishMember = translations.en.teamSection.members.find((candidate) => candidate.name === member?.name);
    const swahiliMember = translations.sw.teamSection.members.find((candidate) => candidate.name === member?.name);
    setTeamMemberForm(member ? {
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      location: member.location || '',
      badge: member.badge || '',
      photo: member.photo || '',
      roleEn: member.translations?.en?.role || englishMember?.role || '',
      roleSw: member.translations?.sw?.role || swahiliMember?.role || '',
      locationEn: member.translations?.en?.location || englishMember?.location || '',
      locationSw: member.translations?.sw?.location || swahiliMember?.location || '',
      bioEn: member.translations?.en?.bio || englishMember?.bio || '',
      bioSw: member.translations?.sw?.bio || swahiliMember?.bio || '',
      badgeEn: member.translations?.en?.badge || englishMember?.badge || '',
      badgeSw: member.translations?.sw?.badge || swahiliMember?.badge || ''
    } : {
      name: '',
      role: '',
      bio: '',
      location: '',
      badge: '',
      photo: '',
      roleEn: '',
      roleSw: '',
      locationEn: '',
      locationSw: '',
      bioEn: '',
      bioSw: '',
      badgeEn: '',
      badgeSw: ''
    });
    setShowTeamMemberForm(true);
  };

  const handleTeamPhotoChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner un fichier image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast("L'image ne doit pas dépasser 8 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => showToast("Impossible de lire l'image sélectionnée.");
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        showToast("Impossible de lire l'image sélectionnée.");
        return;
      }
      const image = new Image();
      image.onerror = () => showToast("Le fichier sélectionné n'est pas une image valide.");
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 600 / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          showToast("Impossible de traiter l'image sélectionnée.");
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        setTeamMemberForm((current) => ({ ...current, photo: canvas.toDataURL('image/jpeg', 0.82) }));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTeamMember = (event) => {
    event.preventDefault();
    if (!isSuperAdmin) {
      showToast("Action refusée : La gestion de l'équipe est réservée au Super Admin.");
      return;
    }
    const name = teamMemberForm.name.trim();
    const role = teamMemberForm.role.trim();
    if (!name || !role || !teamMemberForm.roleEn.trim() || !teamMemberForm.roleSw.trim()
      || (teamMemberForm.location.trim() && (!teamMemberForm.locationEn.trim() || !teamMemberForm.locationSw.trim()))
      || (teamMemberForm.bio.trim() && (!teamMemberForm.bioEn.trim() || !teamMemberForm.bioSw.trim()))
      || (teamMemberForm.badge.trim() && (!teamMemberForm.badgeEn.trim() || !teamMemberForm.badgeSw.trim()))) {
      showToast('Veuillez traduire le rôle et chaque localisation, présentation ou étiquette renseignée en anglais et en kiswahili.');
      return;
    }

    const member = {
      ...teamMemberForm,
      id: editingTeamMemberId || `team_${Date.now()}`,
      name,
      role,
      bio: teamMemberForm.bio.trim(),
      location: teamMemberForm.location.trim(),
      badge: teamMemberForm.badge.trim(),
      translations: {
        en: {
          role: teamMemberForm.roleEn.trim(),
          location: teamMemberForm.locationEn.trim(),
          bio: teamMemberForm.bioEn.trim(),
          badge: teamMemberForm.badgeEn.trim()
        },
        sw: {
          role: teamMemberForm.roleSw.trim(),
          location: teamMemberForm.locationSw.trim(),
          bio: teamMemberForm.bioSw.trim(),
          badge: teamMemberForm.badgeSw.trim()
        }
      },
      initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
      avatarColor: 'linear-gradient(135deg, #0891B2 0%, #0B192C 100%)'
    };
    const updatedMembers = editingTeamMemberId
      ? teamMembers.map((current) => current.id === editingTeamMemberId ? { ...current, ...member } : current)
      : [...teamMembers, member];
    const updatedContent = { ...siteContent, teamMembers: updatedMembers };

    try {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(updatedContent));
      setSiteContent(updatedContent);
      setSiteContentJson(JSON.stringify(updatedContent, null, 2));
      setJsonEditorTouched(false);
      setTeamMembers(updatedMembers);
      window.dispatchEvent(new CustomEvent('mbegu:site-content-change'));
      setShowTeamMemberForm(false);
      setEditingTeamMemberId(null);
      showToast(editingTeamMemberId ? 'Membre de l’équipe mis à jour.' : 'Membre ajouté à l’équipe.');
    } catch (error) {
      console.error(error);
      showToast("Impossible d'enregistrer l'équipe. Vérifiez l'espace de stockage disponible.");
    }
  };

  const handleDeleteTeamMember = (member) => {
    if (!isSuperAdmin) {
      showToast("Action refusée : La gestion de l'équipe est réservée au Super Admin.");
      return;
    }
    if (!window.confirm(`Confirmez-vous la suppression de « ${member.name} » de l'équipe ?`)) return;

    const updatedMembers = teamMembers.filter((current) => current.id !== member.id);
    const updatedContent = { ...siteContent, teamMembers: updatedMembers };
    try {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(updatedContent));
      setSiteContent(updatedContent);
      setSiteContentJson(JSON.stringify(updatedContent, null, 2));
      setJsonEditorTouched(false);
      setTeamMembers(updatedMembers);
      window.dispatchEvent(new CustomEvent('mbegu:site-content-change'));
      showToast('Membre supprimé de l’équipe.');
    } catch (error) {
      console.error(error);
      showToast("Impossible d'enregistrer la suppression du membre.");
    }
  };

  const handleSaveSiteContent = () => {
    if (!isSuperAdmin) {
      showToast("Action refusée : Modification du site réservée au Super Admin.");
      return;
    }
    try {
      const completeContent = jsonEditorTouched
        ? JSON.parse(siteContentJson || '{}')
        : siteContent;
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(completeContent));
      setSiteContent(completeContent);
      setSiteContentJson(JSON.stringify(completeContent, null, 2));
      setJsonEditorTouched(false);
      window.dispatchEvent(new CustomEvent('mbegu:site-content-change'));
      showToast('Contenu du site public mis à jour.');
    } catch (error) {
      console.error(error);
      showToast("Impossible d'enregistrer le contenu.");
    }
  };

  const handleSaveConnectionRedirect = (newUrl, newDeepLink) => {
    if (!isSuperAdmin) {
      showToast("Action refusée : Redirection de connexion réservée au Super Admin.");
      return;
    }
    const updated = {
      ...siteContent,
      connectionAppUrl: newUrl,
      connectionDeepLink: newDeepLink
    };
    try {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(updated));
      setSiteContent(updated);
      setSiteContentJson(JSON.stringify(updated, null, 2));
      window.dispatchEvent(new CustomEvent('mbegu:site-content-change'));
      showToast('Lien de redirection de connexion mis à jour et actif !');
    } catch (error) {
      console.error(error);
      showToast("Impossible d'enregistrer le lien de redirection.");
    }
  };

  // Authenticate Admin (SuperAdmin or Sub-Admin)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const cleanUser = adminUsername.trim();
    const cleanPass = adminPassword.trim();

    // 1. Check SuperAdmin credentials
    if (cleanUser === superAdminCreds.username && cleanPass === superAdminCreds.password) {
      const session = {
        username: superAdminCreds.username,
        fullName: superAdminCreds.fullName || 'Super Administrateur',
        role: 'superadmin'
      };
      setAdminSession(session);
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      } catch {
        // storage ignored
      }
      setAdminPinError(false);
      setAdminUsername('');
      setAdminPassword('');
      showToast("Bienvenue Super Administrateur (Accès Total) !");
      return;
    }

    // 2. Check Sub-Admins added by SuperAdmin
    const foundSubAdmin = subAdmins.find(
      (a) => a.username.toLowerCase() === cleanUser.toLowerCase() && a.password === cleanPass
    );

    if (foundSubAdmin) {
      const session = {
        id: foundSubAdmin.id,
        username: foundSubAdmin.username,
        fullName: foundSubAdmin.fullName || foundSubAdmin.username,
        role: 'restricted'
      };
      setAdminSession(session);
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      } catch {
        // storage ignored
      }
      setAdminPinError(false);
      setAdminUsername('');
      setAdminPassword('');
      showToast(`Bienvenue ${session.fullName} (Accès : Taux, Pilotes & Actualités)`);
      return;
    }

    setAdminPinError(true);
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {
      // storage ignored
    }
    showToast('Déconnexion Administrateur effectuée.');
  };

  // Create Sub-Admin (SuperAdmin only)
  const handleCreateSubAdmin = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast("Seul le SuperAdmin peut créer des comptes administrateurs.");
      return;
    }

    const cleanUser = newAdminUsername.trim();
    const cleanPass = newAdminPassword.trim();
    const cleanName = newAdminFullName.trim();

    if (!cleanUser || !cleanPass) {
      showToast("Veuillez renseigner un identifiant et un mot de passe.");
      return;
    }

    if (cleanUser.length < 3) {
      showToast("L'identifiant doit comporter au moins 3 caractères.");
      return;
    }

    if (cleanPass.length < 4) {
      showToast("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }

    if (cleanUser.toLowerCase() === superAdminCreds.username.toLowerCase()) {
      showToast("Cet identifiant est réservé au SuperAdmin principal.");
      return;
    }

    const alreadyExists = subAdmins.some(
      (a) => a.username.toLowerCase() === cleanUser.toLowerCase()
    );
    if (alreadyExists) {
      showToast("Un administrateur avec cet identifiant existe déjà.");
      return;
    }

    const newAccount = {
      id: 'admin_' + Date.now(),
      fullName: cleanName || cleanUser,
      username: cleanUser,
      password: cleanPass,
      role: 'restricted',
      permissionsDesc: 'Modifier le taux, Ajouter les pilotes & Gérer les actualités',
      createdAt: new Date().toISOString()
    };

    setSubAdmins([newAccount, ...subAdmins]);
    setNewAdminFullName('');
    setNewAdminUsername('');
    setNewAdminPassword('');
    setShowCreateAdminPassword(false);
    showToast(`Compte administrateur « ${newAccount.fullName} » créé avec succès !`);
  };

  const handleDeleteSubAdmin = (adminId, adminName) => {
    if (!isSuperAdmin) {
      showToast("Seul le SuperAdmin peut supprimer un administrateur.");
      return;
    }

    if (window.confirm(`Confirmez-vous la suppression du compte administrateur « ${adminName} » ?`)) {
      setSubAdmins(subAdmins.filter(a => a.id !== adminId));
      showToast(`Administrateur « ${adminName} » supprimé.`);
    }
  };

  // SuperAdmin Edit Own Credentials
  const handleOpenEditSuperAdminModal = () => {
    setSuperAdminEditForm({
      fullName: superAdminCreds.fullName || 'Super Administrateur Principal',
      username: superAdminCreds.username,
      password: superAdminCreds.password,
      confirmPassword: superAdminCreds.password
    });
    setShowSuperAdminEditPassword(false);
    setShowEditSuperAdminModal(true);
  };

  const handleSaveSuperAdminCreds = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast("Action refusée : Seul le SuperAdmin peut modifier ses accès.");
      return;
    }

    const cleanName = superAdminEditForm.fullName.trim();
    const cleanUser = superAdminEditForm.username.trim();
    const cleanPass = superAdminEditForm.password.trim();
    const cleanConfirm = superAdminEditForm.confirmPassword.trim();

    if (!cleanUser || !cleanPass) {
      showToast("Identifiant et mot de passe requis.");
      return;
    }
    if (cleanUser.length < 3) {
      showToast("L'identifiant doit comporter au moins 3 caractères.");
      return;
    }
    if (cleanPass.length < 4) {
      showToast("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }
    if (cleanPass !== cleanConfirm) {
      showToast("Les mots de passe ne correspondent pas.");
      return;
    }

    const collisionWithSubAdmin = subAdmins.some(
      a => a.username.toLowerCase() === cleanUser.toLowerCase()
    );
    if (collisionWithSubAdmin) {
      showToast("Cet identifiant est déjà utilisé par un autre administrateur.");
      return;
    }

    const updatedCreds = {
      fullName: cleanName || 'Super Administrateur Principal',
      username: cleanUser,
      password: cleanPass
    };

    setSuperAdminCreds(updatedCreds);
    try {
      localStorage.setItem(SUPER_ADMIN_STORAGE_KEY, JSON.stringify(updatedCreds));
    } catch (err) {
      console.error(err);
    }

    // Keep active session in sync
    const updatedSession = {
      ...adminSession,
      fullName: updatedCreds.fullName,
      username: updatedCreds.username
    };
    setAdminSession(updatedSession);
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedSession));
    } catch (err) {
      console.error(err);
    }

    setShowEditSuperAdminModal(false);
    showToast("Vos identifiants SuperAdmin ont été mis à jour avec succès !");
  };

  // SuperAdmin Edit Sub-Admin Credentials
  const handleOpenEditSubAdminModal = (admin) => {
    if (!isSuperAdmin) {
      showToast("Action refusée : Seul le SuperAdmin peut modifier les autres administrateurs.");
      return;
    }
    setEditingSubAdminId(admin.id);
    setSubAdminEditForm({
      fullName: admin.fullName || '',
      username: admin.username || '',
      password: admin.password || ''
    });
    setShowSubAdminEditPassword(false);
    setShowEditSubAdminModal(true);
  };

  const handleSaveSubAdminCreds = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showToast("Action refusée : Seul le SuperAdmin peut modifier les administrateurs.");
      return;
    }

    const cleanName = subAdminEditForm.fullName.trim();
    const cleanUser = subAdminEditForm.username.trim();
    const cleanPass = subAdminEditForm.password.trim();

    if (!cleanUser || !cleanPass) {
      showToast("Identifiant et mot de passe requis.");
      return;
    }
    if (cleanUser.length < 3) {
      showToast("L'identifiant doit comporter au moins 3 caractères.");
      return;
    }
    if (cleanPass.length < 4) {
      showToast("Le mot de passe doit comporter au moins 4 caractères.");
      return;
    }

    if (cleanUser.toLowerCase() === superAdminCreds.username.toLowerCase()) {
      showToast("Cet identifiant est réservé au SuperAdmin principal.");
      return;
    }

    const collisionWithOther = subAdmins.some(
      a => a.id !== editingSubAdminId && a.username.toLowerCase() === cleanUser.toLowerCase()
    );
    if (collisionWithOther) {
      showToast("Cet identifiant est déjà utilisé par un autre administrateur.");
      return;
    }

    const updatedSubAdmins = subAdmins.map(a => {
      if (a.id === editingSubAdminId) {
        return {
          ...a,
          fullName: cleanName || cleanUser,
          username: cleanUser,
          password: cleanPass,
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    });

    setSubAdmins(updatedSubAdmins);
    setShowEditSubAdminModal(false);
    showToast(`Identifiants de l'administrateur mis à jour avec succès !`);
  };

  // News / Actualités Actions (Accessible to BOTH SuperAdmin and Restricted Admin)
  const BADGE_PRESETS = [
    { label: 'Pilote MVP v0.1', color: '#0891B2', bg: '#F0FDFA' },
    { label: 'Technologie & Résilience', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Module Commerçants', color: '#6366F1', bg: '#EEF2FF' },
    { label: 'Partenariat Stratégique', color: '#D97706', bg: '#FEF3C7' },
    { label: 'Sécurité & Conformité', color: '#059669', bg: '#D1FAE5' },
    { label: 'Communiqué Officiel', color: '#0B192C', bg: '#E2E8F0' },
  ];

  const handleOpenAddArticleModal = () => {
    const todayStr = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setEditingArticleId(null);
    setArticleForm({
      title: '',
      badge: 'Pilote MVP v0.1',
      badgeColor: '#0891B2',
      badgeBg: '#F0FDFA',
      date: todayStr,
      readTime: '3 min de lecture',
      excerpt: '',
      content: '',
      translations: {
        en: { title: '', badge: '', date: '', readTime: '', excerpt: '', content: '' },
        sw: { title: '', badge: '', date: '', readTime: '', excerpt: '', content: '' }
      }
    });
    setShowArticleModal(true);
  };

  const handleOpenEditArticleModal = (art) => {
    setEditingArticleId(art.id);
    const defaultEnglish = translations.en.newsSection.articles?.[art.id];
    const defaultSwahili = translations.sw.newsSection.articles?.[art.id];
    setArticleForm({
      title: art.title || '',
      badge: art.badge || 'Pilote MVP v0.1',
      badgeColor: art.badgeColor || '#0891B2',
      badgeBg: art.badgeBg || '#F0FDFA',
      date: art.date || '',
      readTime: art.readTime || '3 min de lecture',
      excerpt: art.excerpt || '',
      content: art.content || '',
      translations: {
        en: { ...defaultEnglish, ...art.translations?.en },
        sw: { ...defaultSwahili, ...art.translations?.sw }
      }
    });
    setShowArticleModal(true);
  };

  const handleSaveArticleSubmit = (e) => {
    e.preventDefault();
    if (!articleForm.title.trim() || !articleForm.content.trim()
      || !articleForm.translations.en.title?.trim()
      || !articleForm.translations.en.excerpt?.trim()
      || !articleForm.translations.en.content?.trim()
      || !articleForm.translations.sw.title?.trim()
      || !articleForm.translations.sw.excerpt?.trim()
      || !articleForm.translations.sw.content?.trim()) {
      showToast("Veuillez renseigner le titre, le résumé et le contenu de l'article en français, en anglais et en kiswahili.");
      return;
    }

    if (editingArticleId) {
      const updated = articles.map(a => {
        if (a.id === editingArticleId) {
          return {
            ...a,
            ...articleForm,
            updatedAt: new Date().toISOString(),
            updatedBy: adminSession?.username || 'admin'
          };
        }
        return a;
      });
      setArticles(updated);
      saveNewsArticles(updated);
      showToast("Article mis à jour avec succès sur le site public !");
    } else {
      const newArticle = {
        id: 'news_' + Date.now(),
        ...articleForm,
        createdAt: new Date().toISOString(),
        createdBy: adminSession?.username || 'admin'
      };
      const updated = [newArticle, ...articles];
      setArticles(updated);
      saveNewsArticles(updated);
      showToast("Nouvel article publié avec succès sur le site public !");
    }

    setShowArticleModal(false);
  };

  const handleDeleteArticle = (articleId, articleTitle) => {
    if (window.confirm(`Confirmez-vous la suppression de l'article « ${articleTitle} » du site public ?`)) {
      const updated = articles.filter(a => a.id !== articleId);
      setArticles(updated);
      saveNewsArticles(updated);
      showToast(`Article supprimé du site public.`);
    }
  };

  // Pilot Actions
  const handleUpdatePilotStatus = (index, newStatus) => {
    const updated = [...pilots];
    updated[index] = { ...updated[index], status: newStatus };
    setPilots(updated);
    showToast(`Candidat mis à jour : Statut "${newStatus}".`);
  };

  const handleDeletePilot = (index) => {
    if (!isSuperAdmin) {
      showToast("Action refusée : La suppression d'un candidat est réservée au Super Admin.");
      return;
    }
    if (window.confirm('Voulez-vous supprimer ce candidat du programme pilote ?')) {
      const updated = pilots.filter((_, i) => i !== index);
      setPilots(updated);
      showToast('Candidat supprimé.');
    }
  };

  const handleAddPilotSubmit = (e) => {
    e.preventDefault();
    if (!newPilot.fullName || !newPilot.phone) return;

    const pilotEntry = {
      ...newPilot,
      id: 'pilot_' + Date.now(),
      status: 'validé',
      timestamp: new Date().toISOString()
    };

    setPilots([pilotEntry, ...pilots]);
    setShowAddPilotModal(false);
    setNewPilot({ fullName: '', phone: '', email: '', role: 'commercant', city: 'Kinshasa', currencyPref: 'CDF_USD' });
    showToast(`Candidat ${pilotEntry.fullName} ajouté avec succès !`);
  };

  // Contact via WhatsApp
  const handleContactWhatsApp = (pilot) => {
    const text = encodeURIComponent(`Bonjour ${pilot.fullName}, nous vous confirmons la sélection de votre dossier pour le programme Pilote Officiel de MBEGU Capital (${pilot.role === 'commercant' ? 'Module Caisse & Créances' : 'Gestion Financière'}). Êtes-vous disponible pour activer vos accès privés ?`);
    const cleanPhone = pilot.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    showToast(`WhatsApp ouvert pour ${pilot.fullName}`);
  };

  // Export Pilots to CSV
  const handleExportPilotsCSV = () => {
    const headers = ['Nom Complet,Telephone WhatsApp,Email,Profil,Ville,Devise Preferee,Statut,Date Inscription'];
    const rows = pilots.map(p =>
      `"${p.fullName}","${p.phone}","${p.email || ''}","${p.role}","${p.city}","${p.currencyPref}","${p.status || 'en attente'}","${p.timestamp || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers, ...rows].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `mbegu_candidats_pilote_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Liste des candidats exportée en CSV !');
  };

  // Export Pilots to PDF
  const handleExportPilotsPDF = () => {
    const printWindow = window.open('', '_blank', 'width=920,height=780');
    if (!printWindow) {
      showToast('Veuillez autoriser les fenêtres pop-up pour générer le PDF.');
      return;
    }

    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const rowsHtml = pilots.map((p, idx) => `
      <tr style="border-bottom: 1px solid #E2E8F0; ${idx % 2 === 0 ? 'background-color: #F8FAFC;' : ''}">
        <td style="padding: 10px 12px; font-weight: 700; color: #0B192C;">${p.fullName}</td>
        <td style="padding: 10px 12px; color: #1E293B;">${p.phone}</td>
        <td style="padding: 10px 12px; color: #64748B;">${p.email || '—'}</td>
        <td style="padding: 10px 12px;">
          <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: ${p.role === 'commercant' ? '#ECFEFF' : '#F1F5F9'}; color: ${p.role === 'commercant' ? '#0891B2' : '#475569'};">
            ${p.role === 'commercant' ? 'Commerçant' : p.role === 'pme' ? 'PME' : 'Particulier'}
          </span>
        </td>
        <td style="padding: 10px 12px; color: #334155;">${p.city || 'Kinshasa'}</td>
        <td style="padding: 10px 12px;">
          <span style="font-weight: 700; font-size: 11px; text-transform: uppercase; color: ${p.status === 'validé' ? '#059669' : p.status === 'contacté' ? '#2563EB' : '#D97706'};">
            ${p.status || 'en attente'}
          </span>
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>MBEGU_Capital_Candidats_Pilote_${new Date().toISOString().split('T')[0]}</title>
        <style>
          @page { size: A4 portrait; margin: 16mm 14mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; margin: 0; padding: 24px; font-size: 13px; line-height: 1.45; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0891B2; padding-bottom: 16px; margin-bottom: 22px; }
          .brand-title { font-size: 22px; font-weight: 800; color: #0B192C; }
          .brand-sub { font-size: 12px; color: #0891B2; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
          .meta-box { text-align: right; font-size: 12px; color: #64748B; }
          .summary-strip { display: flex; gap: 14px; margin-bottom: 22px; }
          .summary-card { flex: 1; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; }
          .summary-val { font-size: 18px; font-weight: 800; color: #0B192C; }
          .summary-lbl { font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; }
          th { background-color: #0B192C; color: #FFFFFF; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
          .footer-note { margin-top: 28px; padding-top: 14px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94A3B8; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; padding: 12px 16px; background: #ECFEFF; border: 1px solid #A5F3FC; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: 700; color: #0891B2;">
            📄 Rapport officiel MBEGU Capital prêt à l'impression ou à l'export PDF.
          </span>
          <button onclick="window.print()" style="background: #0891B2; color: #FFF; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer;">
            Imprimer / Enregistrer en PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="brand-title">MBEGU Capital</div>
            <div class="brand-sub">Programme Pilote v0.1 • Rapport d'extraction</div>
          </div>
          <div class="meta-box">
            <div><strong>Espace Administrateur</strong></div>
            <div>Date : ${dateStr}</div>
            <div>Taux officiel : 1 USD = ${exchangeRate} CDF</div>
          </div>
        </div>

        <div class="summary-strip">
          <div class="summary-card">
            <div class="summary-lbl">Total Candidats</div>
            <div class="summary-val">${pilots.length} / 30 places</div>
          </div>
          <div class="summary-card">
            <div class="summary-lbl">Validés</div>
            <div class="summary-val" style="color: #059669;">
              ${pilots.filter(p => p.status === 'validé').length}
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-lbl">Contactés WhatsApp</div>
            <div class="summary-val" style="color: #2563EB;">
              ${pilots.filter(p => p.status === 'contacté').length}
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-lbl">En Attente</div>
            <div class="summary-val" style="color: #D97706;">
              ${pilots.filter(p => !p.status || p.status === 'en attente').length}
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Candidat</th>
              <th>WhatsApp / Téléphone</th>
              <th>E-mail</th>
              <th>Profil</th>
              <th>Ville</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer-note">
          <span>&copy; ${new Date().getFullYear()} MBEGU Capital Inc. • Kinshasa • Goma • Lubumbashi</span>
          <span>Document certifié généré depuis l'Espace Administrateur</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast('Document PDF prêt pour impression / enregistrement !');
  };

  // Update Exchange Rate
  const handleSaveRate = (newRate) => {
    const rateNum = Number(newRate);
    if (!rateNum || rateNum <= 0) return;
    setExchangeRate(rateNum);
    try {
      localStorage.setItem('@mbegu_capital_live_v1_rate', String(rateNum));
      window.dispatchEvent(new CustomEvent('mbegu:exchange-rate-change', { detail: { exchangeRate: rateNum } }));
    } catch {
      // storage ignored
    }
    showToast(`Taux officiel système mis à jour : 1 USD = ${rateNum} CDF`);
  };

  // Filtered pilots list
  const filteredPilots = useMemo(() => {
    return pilots.filter(p => {
      if (filterRole !== 'all' && p.role !== filterRole) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          (p.fullName || '').toLowerCase().includes(q) ||
          (p.phone || '').includes(q) ||
          (p.city || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pilots, filterRole, searchQuery]);

  // If not authenticated as Admin, show Admin Pin Gate
  if (!isAdminAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 30%, #152A4A 0%, #0B192C 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '40px 36px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)',
          textAlign: 'center',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0B192C 0%, #06B6D4 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 20px rgba(6, 182, 212, 0.25)'
          }}>
            <IconShield size={32} />
          </div>

          <span className="badge-cyan" style={{ marginBottom: '12px' }}>
            Espace Administrateur Restreint
          </span>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B192C', marginBottom: '24px' }}>
            MBEGU Capital Admin
          </h2>

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textAlign: 'left' }}>
                Identifiant administrateur
              </label>
              <input
                autoFocus
                autoComplete="username"
                placeholder="Identifiant"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.9375rem',
                  borderRadius: '12px',
                  border: adminPinError ? '2px solid #EF4444' : '1px solid #CBD5E1',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textAlign: 'left' }}>
                Mot de passe
              </label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Mot de passe"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.9375rem',
                  borderRadius: '12px',
                  border: adminPinError ? '2px solid #EF4444' : '1px solid #CBD5E1',
                  outline: 'none'
                }}
              />
              {adminPinError && (
                <div style={{ fontSize: '0.8125rem', color: '#EF4444', marginTop: '6px' }}>
                  Identifiant ou mot de passe incorrect.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '0.9375rem' }}
            >
              Déverrouiller l'Espace Admin
            </button>
          </form>

          <div style={{ marginTop: '20px' }}>
            <button
              type="button"
              onClick={onReturnToWebsite}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← Retour au site vitrine public
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0B192C',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          border: '1px solid #06B6D4'
        }}>
          <IconCheck size={18} style={{ color: '#00D2B4' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header style={{ background: '#0B192C', color: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #1E293B' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', gap: '16px' }}>
          {/* Logo & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
              <img src="/logo.jpg" alt="MBEGU Capital Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#FFFFFF' }}>
                  MBEGU <span style={{ color: '#00D2B4' }}>Admin</span>
                </span>
                {isSuperAdmin ? (
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(6, 182, 212, 0.2)',
                    color: '#00D2B4',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <IconShield size={12} />
                    <span>Super Admin</span>
                  </span>
                ) : (
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#FBBF24',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <IconLock size={12} />
                    <span>Admin Opérateur (Taux, Pilotes & Actualités)</span>
                  </span>
                )}
                {adminSession && (
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
                    • {adminSession.fullName || adminSession.username}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Live Exchange Rate Pill */}
            <div style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#38BDF8'
            }} className="admin-rate-pill">
              <IconCoins size={14} />
              <span>1 USD = {exchangeRate} CDF</span>
            </div>

            {/* Return to Public Website */}
            <button
              type="button"
              onClick={onReturnToWebsite}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.18)',
                cursor: 'pointer'
              }}
            >
              <span>Site Vitrine</span>
              &rarr;
            </button>

            {/* Logout Admin */}
            <button
              type="button"
              onClick={handleAdminLogout}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Quitter l'espace admin"
            >
              Quitter
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="container" style={{ flex: 1, padding: '28px 20px 60px' }}>
        {/* KPI Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* KPI 1: Pilot Signups */}
          <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>Candidats Pilote v0.1</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0891B2' }}></span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B192C' }}>
              {pilots.length} <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#94A3B8' }}>/ 30 places</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ width: `${Math.min(100, (pilots.length / 30) * 100)}%`, height: '100%', background: '#06B6D4' }}></div>
            </div>
          </div>

          {/* KPI 2: News Articles */}
          <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>Articles & Actualités</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B192C' }}>
              {articles.length} <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#94A3B8' }}>publiés</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '6px', fontWeight: 600 }}>
              Géré par vous & SuperAdmin
            </div>
          </div>

          {/* KPI 3: System Exchange Rate */}
          <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>Taux Officiel Système</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1' }}></span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B192C' }}>
              {exchangeRate} <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#64748B' }}>CDF / USD</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
              {isRestrictedAdmin ? '✅ Vous pouvez modifier ce taux' : 'Appliqué sur tout le site public'}
            </div>
          </div>

          {/* KPI 4: Infrastructure */}
          <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748B' }}>Disponibilité & Sync</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>
              100% Hors-Ligne
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
              Stockage Local Chiffré AES-256
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: '#FFFFFF',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          marginBottom: '24px',
          overflowX: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('pilots')}
            style={{
              flex: 1,
              padding: '11px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'pilots' ? '#0B192C' : 'transparent',
              color: activeTab === 'pilots' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            📋 Candidats au Pilote ({pilots.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('news')}
            style={{
              flex: 1,
              padding: '11px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'news' ? '#0B192C' : 'transparent',
              color: activeTab === 'news' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            📰 Actualités ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            style={{
              flex: 1,
              padding: '11px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'team' ? '#0B192C' : 'transparent',
              color: activeTab === 'team' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            👥 Équipe ({teamMembers.length}) {isRestrictedAdmin && '🔒'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            style={{
              flex: 1,
              padding: '11px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'content' ? '#0B192C' : 'transparent',
              color: activeTab === 'content' ? '#FFFFFF' : '#475569'
            }}
          >
            🌐 Contenu du Site {isRestrictedAdmin && '🔒'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            style={{
              flex: 1,
              padding: '11px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'config' ? '#0B192C' : 'transparent',
              color: activeTab === 'config' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            ⚙️ Redirection Connexion & Système
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admins')}
            style={{
              flex: 1,
              padding: '11px 18px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === 'admins' ? '#0B192C' : 'transparent',
              color: activeTab === 'admins' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s'
            }}
          >
            👥 Équipe & Gestion Admins ({1 + subAdmins.length}) {isRestrictedAdmin && '🔒'}
          </button>
        </div>

        {/* TAB 1: PILOT CANDIDATES */}
        {activeTab === 'pilots' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px' }}>
            {isRestrictedAdmin && (
              <div style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                fontSize: '0.8125rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <IconCheck size={16} style={{ color: '#059669', flexShrink: 0 }} />
                <span>Autorisations actives : Vous pouvez ajouter des candidats au pilote, gérer l'onglet Actualités et modifier le taux de change.</span>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                  Gestion des Testeurs Pionniers (Programme Pilote v0.1)
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                  Validez les candidatures, contactez les commerçants par WhatsApp et exportez les données.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowAddPilotModal(true)}
                  className="btn btn-primary"
                  style={{ padding: '9px 16px', fontSize: '0.8125rem' }}
                >
                  + Ajouter un candidat
                </button>
                <button
                  type="button"
                  onClick={handleExportPilotsCSV}
                  className="btn btn-secondary"
                  style={{ padding: '9px 14px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <IconFileSpreadsheet size={16} />
                  <span>Exporter CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportPilotsPDF}
                  className="btn btn-secondary"
                  style={{
                    padding: '9px 14px',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#F0FDFA',
                    borderColor: '#CCFBF1',
                    color: '#0891B2',
                    fontWeight: 700
                  }}
                  title="Exporter le rapport des candidats au format PDF"
                >
                  <IconFileText size={16} />
                  <span>Exporter PDF</span>
                </button>
              </div>
            </div>

            {/* Filters & Search */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFilterRole('all')}
                  style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: filterRole === 'all' ? '#0B192C' : 'transparent', color: filterRole === 'all' ? '#FFFFFF' : '#64748B' }}
                >
                  Tous
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole('commercant')}
                  style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: filterRole === 'commercant' ? '#0891B2' : 'transparent', color: filterRole === 'commercant' ? '#FFFFFF' : '#64748B' }}
                >
                  Commerçants
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole('particulier')}
                  style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: filterRole === 'particulier' ? '#0891B2' : 'transparent', color: filterRole === 'particulier' ? '#FFFFFF' : '#64748B' }}
                >
                  Particuliers
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRole('pme')}
                  style={{ padding: '6px 12px', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: filterRole === 'pme' ? '#0891B2' : 'transparent', color: filterRole === 'pme' ? '#FFFFFF' : '#64748B' }}
                >
                  PME
                </button>
              </div>

              <input
                type="text"
                placeholder="Rechercher par nom, ville ou téléphone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, minWidth: '220px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', outline: 'none' }}
              />
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Candidat</th>
                    <th style={{ padding: '12px 14px' }}>WhatsApp & Contact</th>
                    <th style={{ padding: '12px 14px' }}>Profil</th>
                    <th style={{ padding: '12px 14px' }}>Ville</th>
                    <th style={{ padding: '12px 14px' }}>Statut</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPilots.map((p, index) => (
                    <tr key={p.id || index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#0F172A' }}>
                        {p.fullName}
                        {p.email && <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 400 }}>{p.email}</div>}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontWeight: 600, color: '#0B192C' }}>{p.phone}</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: p.role === 'commercant' ? '#ECFEFF' : '#F1F5F9',
                          color: p.role === 'commercant' ? '#0891B2' : '#475569'
                        }}>
                          {p.role === 'commercant' ? 'Commerçant' : p.role === 'pme' ? 'PME' : 'Particulier'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#475569', fontSize: '0.8125rem' }}>
                        {p.city || 'Kinshasa'}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <select
                          value={p.status || 'en attente'}
                          onChange={(e) => handleUpdatePilotStatus(index, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: p.status === 'validé' ? '#ECFDF5' : p.status === 'contacté' ? '#EFF6FF' : '#FFFBEB',
                            color: p.status === 'validé' ? '#059669' : p.status === 'contacté' ? '#2563EB' : '#D97706',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="en attente">En attente</option>
                          <option value="contacté">Contacté WhatsApp</option>
                          <option value="validé">Validé (Accès Actif)</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleContactWhatsApp(p)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#25D366',
                              color: '#FFFFFF',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Ouvrir WhatsApp avec message personnalisé"
                          >
                            <IconWhatsApp size={14} />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePilot(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: isSuperAdmin ? '#94A3B8' : '#CBD5E1',
                              cursor: isSuperAdmin ? 'pointer' : 'not-allowed',
                              padding: '4px 6px',
                              fontSize: '0.875rem'
                            }}
                            title={isSuperAdmin ? "Supprimer le candidat" : "Suppression réservée au Super Admin"}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: NEWS & ARTICLES (Managed by SuperAdmin and Restricted Admin) */}
        {activeTab === 'news' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                  Gestion des Actualités & Communiqués ({articles.length})
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                  Rédigez, modifiez et publiez les articles affichés dans l'onglet Actualités du site vitrine public.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#059669',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <IconCheck size={14} />
                  <span>Gestion ouverte (SuperAdmin & Opérateur)</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddArticleModal}
                  className="btn btn-primary"
                  style={{ padding: '9px 16px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <IconNewspaper size={16} />
                  <span>+ Rédiger un article</span>
                </button>
              </div>
            </div>

            {/* Articles list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              {articles.map((art) => (
                <div
                  key={art.id}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: art.badgeBg || '#F0FDFA',
                        color: art.badgeColor || '#0891B2',
                        border: `1px solid ${art.badgeColor || '#0891B2'}33`
                      }}>
                        {art.badge}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                        {art.date}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0B192C', lineHeight: 1.35, margin: '0 0 8px' }}>
                      {art.title}
                    </h4>

                    <p style={{ fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {art.excerpt}
                    </p>
                  </div>

                  <div style={{
                    paddingTop: '12px',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                      ⏱️ {art.readTime || '3 min de lecture'}
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditArticleModal(art)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          color: '#0891B2',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Modifier cet article"
                      >
                        <IconEdit size={14} />
                        <span>Modifier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid #FECACA',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Supprimer cet article"
                      >
                        <IconTrash2 size={14} />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {articles.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1', color: '#64748B' }}>
                  Aucun article publié pour le moment. Cliquez sur <strong>« + Rédiger un article »</strong> pour diffuser une actualité sur le site vitrine.
                </div>
              )}
            </div>
          </div>
        )}

        {/* PUBLIC WEBSITE TEAM MEMBERS */}
        {activeTab === 'team' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                  Gestion de l’équipe ({teamMembers.length})
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                  Gérez les profils, les photos et les rôles affichés dans la section Équipe du site public.
                </p>
              </div>
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => handleOpenTeamMemberForm()}
                  className="btn btn-primary"
                  style={{ padding: '9px 16px', fontSize: '0.8125rem' }}
                >
                  <IconUserPlus size={16} />
                  Ajouter une personne
                </button>
              )}
            </div>

            {isRestrictedAdmin && (
              <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E', fontSize: '0.8125rem', fontWeight: 600 }}>
                <IconLock size={15} /> La gestion de l’équipe est réservée au Super Admin. Vous pouvez consulter les profils ci-dessous.
              </div>
            )}

            {isSuperAdmin && showTeamMemberForm && (
              <form onSubmit={handleSaveTeamMember} style={{ marginBottom: '24px', padding: '20px', borderRadius: '14px', border: '1px solid #BAE6FD', background: '#F8FCFF' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B192C', marginBottom: '16px' }}>
                  {editingTeamMemberId ? 'Modifier le profil' : 'Ajouter une personne'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Nom complet *
                    <input
                      type="text"
                      required
                      value={teamMemberForm.name}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, name: event.target.value })}
                      placeholder="Nom et prénom"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Rôle / fonction *
                    <input
                      type="text"
                      required
                      value={teamMemberForm.role}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, role: event.target.value })}
                      placeholder="Ex. Directrice des opérations"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Role / position (English) *
                    <input
                      type="text"
                      required
                      value={teamMemberForm.roleEn}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, roleEn: event.target.value })}
                      placeholder="e.g. Operations Director"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Jukumu / cheo (Kiswahili) *
                    <input
                      type="text"
                      required
                      value={teamMemberForm.roleSw}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, roleSw: event.target.value })}
                      placeholder="Mfano: Mkurugenzi wa Uendeshaji"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Ville / localisation
                    <input
                      type="text"
                      value={teamMemberForm.location}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, location: event.target.value })}
                      placeholder="Ex. Kinshasa, RDC"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    City / location (English)
                    <input
                      type="text"
                      value={teamMemberForm.locationEn}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, locationEn: event.target.value })}
                      placeholder="e.g. Kinshasa, DRC"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Mji / eneo (Kiswahili)
                    <input
                      type="text"
                      value={teamMemberForm.locationSw}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, locationSw: event.target.value })}
                      placeholder="Mfano: Kinshasa, DRC"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Étiquette
                    <input
                      type="text"
                      value={teamMemberForm.badge}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, badge: event.target.value })}
                      placeholder="Ex. Direction"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Badge (English)
                    <input
                      type="text"
                      value={teamMemberForm.badgeEn}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, badgeEn: event.target.value })}
                      placeholder="e.g. Leadership"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Lebo (Kiswahili)
                    <input
                      type="text"
                      value={teamMemberForm.badgeSw}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, badgeSw: event.target.value })}
                      placeholder="Mfano: Uongozi"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </label>
                  <label style={{ gridColumn: '1 / -1', fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Présentation (français)
                    <textarea
                      rows="3"
                      value={teamMemberForm.bio}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, bio: event.target.value })}
                      placeholder="Quelques mots sur cette personne"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem', resize: 'vertical' }}
                    />
                  </label>
                  <label style={{ gridColumn: '1 / -1', fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Biography (English)
                    <textarea
                      rows="3"
                      value={teamMemberForm.bioEn}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, bioEn: event.target.value })}
                      placeholder="A short introduction"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem', resize: 'vertical' }}
                    />
                  </label>
                  <label style={{ gridColumn: '1 / -1', fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Wasifu (Kiswahili)
                    <textarea
                      rows="3"
                      value={teamMemberForm.bioSw}
                      onChange={(event) => setTeamMemberForm({ ...teamMemberForm, bioSw: event.target.value })}
                      placeholder="Maelezo mafupi kuhusu mtu huyu"
                      style={{ display: 'block', width: '100%', marginTop: '6px', padding: '10px 12px', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.875rem', resize: 'vertical' }}
                    />
                  </label>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
                    {teamMemberForm.photo && (
                      <img src={teamMemberForm.photo} alt="Aperçu de la photo" style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '14px' }} />
                    )}
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                      Photo (8 Mo maximum)
                      <input type="file" accept="image/*" onChange={handleTeamPhotoChange} style={{ display: 'block', marginTop: '6px', fontSize: '0.8125rem' }} />
                    </label>
                    {teamMemberForm.photo && (
                      <button
                        type="button"
                        onClick={() => setTeamMemberForm({ ...teamMemberForm, photo: '' })}
                        style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#B91C1C', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Retirer la photo
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
                  <button type="button" onClick={() => setShowTeamMemberForm(false)} className="btn btn-secondary" style={{ padding: '9px 14px', fontSize: '0.8125rem' }}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '9px 14px', fontSize: '0.8125rem' }}>
                    Enregistrer le profil
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {teamMembers.map((member, index) => (
                <div key={member.id || `${member.name}-${index}`} style={{ padding: '18px', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '13px' }} />
                    ) : (
                      <div style={{ width: '52px', height: '52px', borderRadius: '13px', background: member.avatarColor || 'linear-gradient(135deg, #0891B2 0%, #0B192C 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        {member.initials || member.name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>{member.name}</h4>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0891B2' }}>{member.role}</div>
                    </div>
                  </div>
                  {member.bio && <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.5, marginBottom: '10px' }}>{member.bio}</p>}
                  {member.location && <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#64748B' }}><IconMapPin size={14} />{member.location}</div>}
                  {isSuperAdmin && (
                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '12px', marginTop: '12px' }}>
                      <button type="button" onClick={() => handleOpenTeamMemberForm(member)} className="btn btn-secondary" style={{ padding: '7px 10px', fontSize: '0.75rem' }}>
                        <IconEdit size={14} /> Modifier
                      </button>
                      <button type="button" onClick={() => handleDeleteTeamMember(member)} style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#B91C1C', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <IconTrash2 size={14} /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', background: '#F8FAFC', borderRadius: '14px', border: '1px dashed #CBD5E1', color: '#64748B' }}>
                  Aucun membre pour le moment. Ajoutez une personne pour la présenter sur le site public.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PUBLIC SITE CONTENT */}
        {activeTab === 'content' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
            {isRestrictedAdmin && (
              <div style={{
                marginBottom: '20px',
                padding: '14px 18px',
                borderRadius: '12px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <IconLock size={20} style={{ color: '#D97706', flexShrink: 0 }} />
                <div style={{ fontSize: '0.875rem', color: '#92400E' }}>
                  <strong>Mode Consultation Uniquement :</strong> En tant qu'administrateur opérateur, vos droits sont limités au taux officiel et aux candidats pilotes. La modification du contenu public est réservée au <strong>Super Admin</strong>.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0B192C' }}>Contenu du Site Public</h3>
                <p style={{ margin: '5px 0 0', color: '#64748B', fontSize: '0.8125rem' }}>
                  Modifiez les textes de l'en-tête, du bloc principal et du pied de page.
                </p>
              </div>
              {isSuperAdmin ? (
                <button type="button" className="btn btn-primary" onClick={handleSaveSiteContent}>
                  Publier les modifications
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled
                  style={{ opacity: 0.65, cursor: 'not-allowed', background: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Réservé au Super Admin"
                >
                  <IconLock size={15} />
                  <span>Publier (Réservé Super Admin)</span>
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {[
                ['brandName', 'Nom de la marque'],
                ['brandVersion', 'Version affichée'],
                ['topBannerText', 'Texte de la bande supérieure'],
                ['topBannerAction', 'Bouton de la bande supérieure'],
                ['heroBadge', 'Badge du titre principal'],
                ['heroTitle', 'Titre principal'],
                ['heroSubtitle', 'Sous-titre principal'],
                ['heroDescription', 'Description principale'],
                ['heroPrimaryCta', 'Bouton principal'],
                ['heroSecondaryCta', 'Bouton secondaire'],
                ['heroDirectAppCta', 'Bouton « application directe »'],
                ['heroOfflineCta', 'Badge hors-ligne du héros'],
                ['heroStatsUsers', 'Statistique utilisateurs'],
                ['heroStatsOffline', 'Statistique hors-ligne'],
                ['heroStatsCurrency', 'Statistique bi-devise'],
                ['featuresBadge', 'Badge de la section fonctionnalités'],
                ['featuresTitle', 'Titre de la section fonctionnalités'],
                ['featuresDescription', 'Description de la section fonctionnalités'],
                ['ctaBannerBadge', 'Badge du bandeau CTA'],
                ['ctaBannerTitle', 'Titre du bandeau CTA'],
                ['ctaBannerDesc', 'Description du bandeau CTA'],
                ['ctaBannerApp', 'Bouton application du bandeau CTA'],
                ['ctaBannerSecondary', 'Bouton pilote du bandeau CTA'],
                ['faqTitle', 'Titre de la FAQ'],
                ['testimonialsBadge', 'Badge des témoignages'],
                ['testimonialsTitle', 'Titre des témoignages'],
                ['testimonialsDescription', 'Description des témoignages'],
                ['footerDescription', 'Description du pied de page'],
                ['footerStatus', 'Statut affiché en pied de page'],
                ['footerProductTitle', 'Titre colonne produit du pied de page'],
                ['footerComplianceTitle', 'Titre colonne conformité du pied de page'],
                ['footerSecurityTitle', 'Titre colonne sécurité du pied de page'],
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                  {label}
                  <input
                    disabled={isRestrictedAdmin}
                    value={siteContent[key]}
                    onChange={(event) => setSiteContent((current) => ({ ...current, [key]: event.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      background: isRestrictedAdmin ? '#F1F5F9' : '#FFFFFF',
                      cursor: isRestrictedAdmin ? 'not-allowed' : 'text'
                    }}
                  />
                </label>
              ))}
            </div>

            <h4 style={{ margin: '24px 0 12px', color: '#0B192C' }}>Réseaux et contact</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {[
                ['whatsapp', 'Numéro WhatsApp (chiffres seuls ex: 243902725344)'],
                ['whatsappDisplay', 'Numéro WhatsApp affiché (ex: +243 902 725 344)'],
                ['instagram', 'Lien Instagram'],
                ['tiktok', 'Lien TikTok'],
                ['youtube', 'Lien YouTube'],
                ['twitter', 'Lien X / Twitter'],
                ['facebook', 'Lien Facebook'],
                ['linkedin', 'Lien LinkedIn'],
                ['contactEmail', 'Adresse e-mail de contact'],
                ['officeKinshasa', 'Adresse / bureau Kinshasa'],
                ['officeGoma', 'Adresse / bureau Goma'],
                ['contactTag', 'Badge de la section contact'],
                ['contactTitle', 'Titre de la section contact'],
                ['contactSubtitle', 'Description de la section contact'],
                ['navWealth', 'Navigation - Patrimoine'],
                ['navSimulator', 'Navigation - Simulateur'],
                ['navMerchants', 'Navigation - Commerçants'],
                ['navOffline', 'Navigation - Hors-ligne'],
                ['navPricing', 'Navigation - Tarifs'],
                ['navFaq', 'Navigation - FAQ'],
                ['navAbout', 'Navigation - À propos'],
                ['navTeam', 'Navigation - Équipe'],
                ['navContact', 'Navigation - Contact'],
                ['navHelpCenter', "Navigation - Centre d'aide"],
                ['navNews', 'Navigation - Actualités'],
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                  {label}
                  <input
                    disabled={isRestrictedAdmin}
                    value={siteContent[key]}
                    onChange={(event) => setSiteContent((current) => ({ ...current, [key]: event.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      background: isRestrictedAdmin ? '#F1F5F9' : '#FFFFFF',
                      cursor: isRestrictedAdmin ? 'not-allowed' : 'text'
                    }}
                  />
                </label>
              ))}
            </div>

            <h4 style={{ margin: '24px 0 12px', color: '#0B192C' }}>Redirection Connexion & Accès Application</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {[
                ['connectionAppUrl', 'Lien Web de Redirection (URL de votre Application)'],
                ['connectionDeepLink', 'Lien Mobile Direct / Deep Link (Android / iOS)'],
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                  {label}
                  <input
                    disabled={isRestrictedAdmin}
                    value={siteContent[key] || ''}
                    placeholder={key === 'connectionAppUrl' ? 'https://app.mbegucapital.com ou http://localhost:8081' : 'neroproject:// ou mbegu://'}
                    onChange={(event) => setSiteContent((current) => ({ ...current, [key]: event.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      background: isRestrictedAdmin ? '#F1F5F9' : '#FFFFFF',
                      cursor: isRestrictedAdmin ? 'not-allowed' : 'text'
                    }}
                  />
                </label>
              ))}
            </div>
            <h4 style={{ margin: '24px 0 12px', color: '#0B192C' }}>Contenu complet du site (JSON)</h4>
            <p style={{ margin: '0 0 10px', color: '#64748B', fontSize: '0.8125rem' }}>
              Éditez ici toutes les données du site, notamment les FAQ et témoignages. La structure JSON doit rester valide.
            </p>
            <textarea
              readOnly={isRestrictedAdmin}
              value={siteContentJson}
              onChange={(event) => {
                if (isRestrictedAdmin) return;
                setSiteContentJson(event.target.value);
                setJsonEditorTouched(true);
              }}
              spellCheck={false}
              style={{
                width: '100%',
                minHeight: '340px',
                resize: 'vertical',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                background: '#0F172A',
                color: '#E2E8F0',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.8125rem',
                lineHeight: 1.55,
                opacity: isRestrictedAdmin ? 0.75 : 1
              }}
            />
          </div>
        )}

        {/* SYSTEM & REDIRECTION CONFIG */}
        {activeTab === 'config' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Connection Redirection Setting */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '28px',
              gridColumn: '1 / -1',
              boxShadow: '0 4px 20px -2px rgba(11,25,44,0.04)'
            }}>
              {isRestrictedAdmin && (
                <div style={{
                  marginBottom: '18px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <IconLock size={18} style={{ color: '#D97706', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8125rem', color: '#92400E' }}>
                    <strong>Configuration restreinte :</strong> La modification des URLs de redirection de l'application est réservée au Super Admin. Vous pouvez néanmoins tester le lien actif ci-dessous.
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconSmartphone size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1875rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                      Redirection Connexion & Lien vers l'Application
                    </h4>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                      Définissez l'adresse URL où rediriger les utilisateurs lorsqu'ils cliquent sur « Connexion » sur le site public
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  background: siteContent.connectionAppUrl ? '#ECFDF5' : '#FFFBEB',
                  color: siteContent.connectionAppUrl ? '#059669' : '#D97706',
                  border: siteContent.connectionAppUrl ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {siteContent.connectionAppUrl ? `🟢 Actif : ${siteContent.connectionAppUrl}` : '⚠️ Aucun lien défini'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Lien Web de Redirection (URL de votre Application) *
                  </label>
                  <input
                    type="url"
                    disabled={isRestrictedAdmin}
                    placeholder="ex: https://app.mbegucapital.com ou http://localhost:8081"
                    value={siteContent.connectionAppUrl || ''}
                    onChange={(e) => setSiteContent(prev => ({ ...prev, connectionAppUrl: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      background: isRestrictedAdmin ? '#F1F5F9' : '#FFFFFF',
                      cursor: isRestrictedAdmin ? 'not-allowed' : 'text'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '5px', display: 'block' }}>
                    Ce lien sera ouvert dans un nouvel onglet pour tout visiteur cliquant sur le bouton « Connexion ».
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Deep Link Mobile (Optionnel - Android / iOS)
                  </label>
                  <input
                    type="text"
                    disabled={isRestrictedAdmin}
                    placeholder="ex: neroproject:// ou mbegu://"
                    value={siteContent.connectionDeepLink || ''}
                    onChange={(e) => setSiteContent(prev => ({ ...prev, connectionDeepLink: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      background: isRestrictedAdmin ? '#F1F5F9' : '#FFFFFF',
                      cursor: isRestrictedAdmin ? 'not-allowed' : 'text'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '5px', display: 'block' }}>
                    Permet d'ouvrir directement l'application installée sur les smartphones Android/iOS.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {isSuperAdmin ? (
                  <button
                    type="button"
                    onClick={() => handleSaveConnectionRedirect(siteContent.connectionAppUrl, siteContent.connectionDeepLink)}
                    className="btn btn-primary"
                    style={{ padding: '11px 22px', fontSize: '0.875rem' }}
                  >
                    Enregistrer la Redirection de Connexion
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="btn btn-primary"
                    style={{ padding: '11px 22px', fontSize: '0.875rem', opacity: 0.65, cursor: 'not-allowed', background: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="Réservé au Super Admin"
                  >
                    <IconLock size={15} />
                    <span>Enregistrer (Réservé Super Admin)</span>
                  </button>
                )}

                {siteContent.connectionAppUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(siteContent.connectionAppUrl, '_blank', 'noopener,noreferrer')}
                    className="btn btn-secondary"
                    style={{ padding: '11px 18px', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>🔗 Tester la redirection en direct</span>
                  </button>
                )}
              </div>
            </div>

            {/* Exchange Rate Setting */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCoins size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    Taux Officiel Système USD / CDF
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Définit le taux de conversion global</span>
                </div>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                <IconCheck size={14} />
                <span>Modification autorisée (Opérateurs & Super Admin)</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                  1 USD = X Francs Congolais (CDF)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    defaultValue={exchangeRate}
                    id="admin-rate-input"
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1.25rem', fontWeight: 800, textAlign: 'center' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('admin-rate-input');
                      if (el && el.value) handleSaveRate(el.value);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '10px 16px', fontSize: '0.8125rem' }}
                  >
                    Appliquer
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5 }}>
                Ce taux est automatiquement utilisé par le convertisseur de devises du simulateur public.
              </p>
            </div>

            {/* Live Public Website Sync Status */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.12)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconShield size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    Synchronisation du Site Public
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>État en direct de la plateforme</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem', color: '#334155' }}>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong>Simulateur public :</strong> Taux appliqué en temps réel (1 USD = {exchangeRate} CDF).
                </div>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong>Programme Pilote :</strong> {pilots.length} / 30 candidatures enregistrées.
                </div>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong>Redirection Connexion :</strong> {siteContent.connectionAppUrl || 'Non configurée'}
                </div>
                <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong>Mode 100% Hors-Ligne :</strong> Actif avec chiffrement local AES-256.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADMIN TEAM & MANAGEMENT */}
        {activeTab === 'admins' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* If Restricted Admin: informational card about their delegated access */}
            {isRestrictedAdmin && (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '28px',
                boxShadow: '0 4px 20px -2px rgba(11,25,44,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconLock size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                      Votre Espace Opérateur (Accès Restreint)
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                      Compte administrateur délégué créé par le Super Admin pour les opérations courantes.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '10px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Identité du Compte</span>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B192C', marginTop: '4px' }}>{adminSession?.fullName}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#0891B2', fontWeight: 600 }}>@{adminSession?.username}</div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46', textTransform: 'uppercase' }}>✅ Vos Autorisations Actives</span>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '0.8125rem', color: '#047857', lineHeight: 1.6 }}>
                      <li><strong>Modifier le taux de change officiel</strong> (USD / CDF)</li>
                      <li><strong>Ajouter des candidats</strong> au programme pilote (export CSV & PDF)</li>
                      <li><strong>Gérer l'onglet Actualités :</strong> Rédiger, modifier et publier les articles du site</li>
                    </ul>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>🔒 Actions Réservées au SuperAdmin</span>
                    <ul style={{ margin: '6px 0 0', paddingLeft: '18px', fontSize: '0.8125rem', color: '#B91C1C', lineHeight: 1.6 }}>
                      <li>Modification des textes généraux du site public</li>
                      <li>Configuration des liens de redirection d'application</li>
                      <li>Création et suppression d'autres administrateurs</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* If SuperAdmin: Form to Add New Sub-Admin */}
            {isSuperAdmin && (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '28px',
                boxShadow: '0 4px 20px -2px rgba(11,25,44,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconUserPlus size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                      Ajouter un Nouvel Administrateur
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                      Créez un compte administrateur supplémentaire avec accès délégué : même interface que vous, avec droits sur le taux officiel, les candidats pilotes et la gestion des actualités.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateSubAdmin} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Nom complet / Libellé *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Jean Kasongo (Opérateur Kinshasa)"
                      value={newAdminFullName}
                      onChange={(e) => setNewAdminFullName(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Identifiant de connexion *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: admin_kinshasa"
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Mot de passe *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCreateAdminPassword ? 'text' : 'password'}
                        required
                        placeholder="Minimum 4 caractères"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCreateAdminPassword(prev => !prev)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                        title={showCreateAdminPassword ? 'Masquer' : 'Afficher'}
                      >
                        {showCreateAdminPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '12px 20px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <IconUserPlus size={18} />
                      <span>Créer l'Administrateur</span>
                    </button>
                  </div>
                </form>

                <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: '#F0FDFA', border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconCheck size={16} style={{ color: '#0891B2', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8125rem', color: '#0F766E' }}>
                    Le compte créé partagera la même interface que le SuperAdmin, avec accès à : <strong>1. La modification du taux officiel CDF/USD</strong>, <strong>2. L'ajout et gestion de candidats pilotes</strong>, et <strong>3. La gestion complète des Actualités du site</strong>.
                  </span>
                </div>
              </div>
            )}

            {/* List of All Administrators */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '28px',
              boxShadow: '0 4px 20px -2px rgba(11,25,44,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                    Comptes Administrateurs Actifs ({1 + subAdmins.length})
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '4px 0 0' }}>
                    Vue d'ensemble de l'équipe d'administration de la plateforme MBEGU Capital.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* 1. SuperAdmin Principal Card */}
                <div style={{
                  padding: '18px 22px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0B192C 0%, #152A4A 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', color: '#00D2B4', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
                      <IconShield size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800 }}>{superAdminCreds.fullName}</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#00D2B4' }}>@{superAdminCreds.username}</span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: 'rgba(0, 210, 180, 0.2)', color: '#00D2B4', border: '1px solid rgba(0, 210, 180, 0.4)' }}>
                          🛡️ Super Admin Principal (Fondateur)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '4px' }}>
                        Contrôle total : Édition intégrale du site, redirection d'application, taux officiel, pilotes, actualités et gestion de tous les identifiants
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Password reveal toggle for SuperAdmin */}
                    {isSuperAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.8125rem' }}>
                        <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Mon MdP :</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00D2B4' }}>
                          {showSuperAdminCurrentPassword ? superAdminCreds.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSuperAdminCurrentPassword(prev => !prev)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94A3B8', display: 'inline-flex', alignItems: 'center' }}
                          title={showSuperAdminCurrentPassword ? 'Masquer mon mot de passe' : 'Afficher mon mot de passe'}
                        >
                          {showSuperAdminCurrentPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                        </button>
                      </div>
                    )}

                    {/* Edit own credentials button (SuperAdmin only) */}
                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={handleOpenEditSuperAdminModal}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: '#0891B2',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3)'
                        }}
                        title="Modifier vos identifiants SuperAdmin (nom, nom d'utilisateur, mot de passe)"
                      >
                        <IconEdit size={15} />
                        <span>Modifier mes identifiants</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Sub-Admins list */}
                {subAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    style={{
                      padding: '18px 22px',
                      borderRadius: '14px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconUsers size={22} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0B192C' }}>
                            {admin.fullName}
                          </span>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0891B2' }}>
                            @{admin.username}
                          </span>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
                            👤 Accès Délégué : Taux, Pilotes & Actualités
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                          Créé le {new Date(admin.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} • Droits : Modifier le taux CDF/USD, ajouter des pilotes et gérer les actualités
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Password reveal toggle for SuperAdmin */}
                      {isSuperAdmin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}>
                          <span style={{ color: '#64748B', fontSize: '0.75rem' }}>MdP :</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0B192C' }}>
                            {revealedPasswords[admin.id] ? admin.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(admin.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#64748B' }}
                            title={revealedPasswords[admin.id] ? 'Masquer' : 'Afficher'}
                          >
                            {revealedPasswords[admin.id] ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                          </button>
                        </div>
                      )}

                      {/* Edit Sub-Admin credentials button (SuperAdmin only) */}
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => handleOpenEditSubAdminModal(admin)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: '#EFF6FF',
                            color: '#2563EB',
                            border: '1px solid #BFDBFE',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          title="Modifier les identifiants de cet administrateur"
                        >
                          <IconEdit size={15} />
                          <span>Modifier</span>
                        </button>
                      )}

                      {/* Delete button (SuperAdmin only) */}
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSubAdmin(admin.id, admin.fullName)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          title="Supprimer ce compte administrateur"
                        >
                          <IconTrash2 size={15} />
                          <span>Supprimer</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {subAdmins.length === 0 && (
                  <div style={{ padding: '28px', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1', color: '#64748B', fontSize: '0.875rem' }}>
                    Aucun administrateur supplémentaire n'a encore été créé. Le SuperAdmin peut en ajouter via le formulaire ci-dessus.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD PILOT MANUALLY */}
      {showAddPilotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 25, 44, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setShowAddPilotModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', marginBottom: '16px' }}>
              Ajouter un Candidat au Pilote
            </h3>

            <form onSubmit={handleAddPilotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Nom complet *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Marie Kapinga"
                  value={newPilot.fullName}
                  onChange={e => setNewPilot({ ...newPilot, fullName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Numéro WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+243 81 000 0000"
                  value={newPilot.phone}
                  onChange={e => setNewPilot({ ...newPilot, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Profil</label>
                  <select
                    value={newPilot.role}
                    onChange={e => setNewPilot({ ...newPilot, role: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}
                  >
                    <option value="commercant">Commerçant</option>
                    <option value="particulier">Particulier</option>
                    <option value="pme">PME</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px' }}>Ville</label>
                  <input
                    type="text"
                    value={newPilot.city}
                    onChange={e => setNewPilot({ ...newPilot, city: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
                Enregistrer le Candidat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT NEWS ARTICLE */}
      {showArticleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 25, 44, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)'
          }}>
            <button
              onClick={() => setShowArticleModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconNewspaper size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                  {editingArticleId ? "Modifier l'Article d'Actualité" : 'Rédiger une Nouvelle Actualité'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Visible directement dans la section Actualités du site vitrine public
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveArticleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                  Titre de l'article *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Déploiement de la version Pilote à Lubumbashi"
                  value={articleForm.title}
                  onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9375rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Catégorie / Badge
                  </label>
                  <select
                    value={articleForm.badge}
                    onChange={e => {
                      const selected = BADGE_PRESETS.find(p => p.label === e.target.value);
                      if (selected) {
                        setArticleForm({
                          ...articleForm,
                          badge: selected.label,
                          badgeColor: selected.color,
                          badgeBg: selected.bg
                        });
                      } else {
                        setArticleForm({ ...articleForm, badge: e.target.value });
                      }
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.8125rem' }}
                  >
                    {BADGE_PRESETS.map((preset, idx) => (
                      <option key={idx} value={preset.label}>{preset.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                    Date d'affichage
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 09 Novembre 2026"
                    value={articleForm.date}
                    onChange={e => setArticleForm({ ...articleForm, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                  Temps de lecture estimé
                </label>
                <input
                  type="text"
                  placeholder="ex: 3 min de lecture"
                  value={articleForm.readTime}
                  onChange={e => setArticleForm({ ...articleForm, readTime: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                  Résumé / Extrait d'accroche *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Bref résumé de 1 à 2 phrases affiché sur la carte d'actualité..."
                  value={articleForm.excerpt}
                  onChange={e => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', lineHeight: 1.5, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                  Contenu complet de l'article *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Texte intégral de l'article (supporte les paragraphes et puces)..."
                  value={articleForm.content}
                  onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8125rem', lineHeight: 1.6, resize: 'vertical' }}
                />
              </div>

              <details open style={{ border: '1px solid #BAE6FD', borderRadius: '10px', padding: '14px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: 800, color: '#0B192C' }}>
                  Traductions obligatoires — English & Kiswahili
                </summary>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px', marginTop: '14px' }}>
                  {['en', 'sw'].map((locale) => {
                    const languageLabel = locale === 'en' ? 'English' : 'Kiswahili';
                    const localizedArticle = articleForm.translations[locale];
                    return (
                      <fieldset key={locale} style={{ minWidth: 0, border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                        <legend style={{ padding: '0 6px', fontSize: '0.8125rem', fontWeight: 800, color: '#0891B2' }}>{languageLabel}</legend>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>
                          Title *
                          <input
                            type="text"
                            required
                            value={localizedArticle.title || ''}
                            onChange={(event) => setArticleForm({
                              ...articleForm,
                              translations: { ...articleForm.translations, [locale]: { ...localizedArticle, title: event.target.value } }
                            })}
                            style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', borderRadius: '7px', border: '1px solid #CBD5E1' }}
                          />
                        </label>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>
                          Category / badge *
                          <input
                            type="text"
                            required
                            value={localizedArticle.badge || ''}
                            onChange={(event) => setArticleForm({
                              ...articleForm,
                              translations: { ...articleForm.translations, [locale]: { ...localizedArticle, badge: event.target.value } }
                            })}
                            style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', borderRadius: '7px', border: '1px solid #CBD5E1' }}
                          />
                        </label>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>
                          Date *
                          <input
                            type="text"
                            required
                            value={localizedArticle.date || ''}
                            onChange={(event) => setArticleForm({
                              ...articleForm,
                              translations: { ...articleForm.translations, [locale]: { ...localizedArticle, date: event.target.value } }
                            })}
                            style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', borderRadius: '7px', border: '1px solid #CBD5E1' }}
                          />
                        </label>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>
                          Reading time *
                          <input
                            type="text"
                            required
                            value={localizedArticle.readTime || ''}
                            onChange={(event) => setArticleForm({
                              ...articleForm,
                              translations: { ...articleForm.translations, [locale]: { ...localizedArticle, readTime: event.target.value } }
                            })}
                            style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', borderRadius: '7px', border: '1px solid #CBD5E1' }}
                          />
                        </label>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', color: '#334155' }}>
                          Summary *
                          <textarea
                            required
                            rows={3}
                            value={localizedArticle.excerpt || ''}
                            onChange={(event) => setArticleForm({
                              ...articleForm,
                              translations: { ...articleForm.translations, [locale]: { ...localizedArticle, excerpt: event.target.value } }
                            })}
                            style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', borderRadius: '7px', border: '1px solid #CBD5E1', resize: 'vertical' }}
                          />
                        </label>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                          Full article *
                          <textarea
                            required
                            rows={5}
                            value={localizedArticle.content || ''}
                            onChange={(event) => setArticleForm({
                              ...articleForm,
                              translations: { ...articleForm.translations, [locale]: { ...localizedArticle, content: event.target.value } }
                            })}
                            style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', borderRadius: '7px', border: '1px solid #CBD5E1', resize: 'vertical' }}
                          />
                        </label>
                      </fieldset>
                    );
                  })}
                </div>
              </details>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '11px', fontSize: '0.875rem' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '11px', fontSize: '0.875rem' }}
                >
                  {editingArticleId ? 'Enregistrer les modifications' : "Publier l'article sur le site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUPERADMIN CREDENTIALS */}
      {showEditSuperAdminModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 25, 44, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '520px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)'
          }}>
            <button
              onClick={() => setShowEditSuperAdminModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconShield size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                  Modifier mes Identifiants SuperAdmin
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Modifiez votre identifiant et mot de passe principal pour la console d'administration
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveSuperAdminCreds} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Nom complet / Libellé affiché *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Super Administrateur Principal"
                  value={superAdminEditForm.fullName}
                  onChange={e => setSuperAdminEditForm({ ...superAdminEditForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Identifiant de connexion SuperAdmin *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: MbeguCapital243"
                  value={superAdminEditForm.username}
                  onChange={e => setSuperAdminEditForm({ ...superAdminEditForm, username: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                  Au moins 3 caractères. Utilisé pour vous connecter à l'espace administrateur.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Nouveau mot de passe *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showSuperAdminEditPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 4 caractères"
                    value={superAdminEditForm.password}
                    onChange={e => setSuperAdminEditForm({ ...superAdminEditForm, password: e.target.value })}
                    style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSuperAdminEditPassword(prev => !prev)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                    title={showSuperAdminEditPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showSuperAdminEditPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Confirmer le mot de passe *
                </label>
                <input
                  type={showSuperAdminEditPassword ? 'text' : 'password'}
                  required
                  placeholder="Répétez le mot de passe"
                  value={superAdminEditForm.confirmPassword}
                  onChange={e => setSuperAdminEditForm({ ...superAdminEditForm, confirmPassword: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ padding: '12px 14px', borderRadius: '10px', background: '#F0FDFA', border: '1px solid #CCFBF1', fontSize: '0.8125rem', color: '#0F766E' }}>
                🔒 <strong>Sécurité :</strong> Votre session actuelle restera active après la mise à jour. Conservez soigneusement votre nouvel identifiant et mot de passe.
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditSuperAdminModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '11px', fontSize: '0.875rem' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '11px', fontSize: '0.875rem' }}
                >
                  Enregistrer mes nouveaux identifiants
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUB-ADMIN CREDENTIALS */}
      {showEditSubAdminModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 25, 44, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)'
          }}>
            <button
              onClick={() => setShowEditSubAdminModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconUsers size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B192C', margin: 0 }}>
                  Modifier l'Administrateur
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Mettez à jour le nom, l'identifiant ou le mot de passe de cet administrateur délégué
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveSubAdminCreds} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Nom complet / Libellé *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Jean Kasongo"
                  value={subAdminEditForm.fullName}
                  onChange={e => setSubAdminEditForm({ ...subAdminEditForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Identifiant de connexion *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: admin_kinshasa"
                  value={subAdminEditForm.username}
                  onChange={e => setSubAdminEditForm({ ...subAdminEditForm, username: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                  Nouveau mot de passe *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showSubAdminEditPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 4 caractères"
                    value={subAdminEditForm.password}
                    onChange={e => setSubAdminEditForm({ ...subAdminEditForm, password: e.target.value })}
                    style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSubAdminEditPassword(prev => !prev)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                    title={showSubAdminEditPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showSubAdminEditPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditSubAdminModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '11px', fontSize: '0.875rem' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '11px', fontSize: '0.875rem' }}
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .admin-rate-pill {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
