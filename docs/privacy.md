# Politique de confidentialité — JackFit

**Dernière mise à jour :** 5 août 2026
**Version :** 1.0

---

## En bref

- JackFit lit tes données Apple Santé (workouts, sommeil, pas) pour calculer un score de forme hebdomadaire et faire vivre ton chien Uma.
- Les échantillons HealthKit bruts que tu partages avec l'app (dates et durées de tes séances, nuits et pas) sont envoyés à notre backend et **stockés chez Supabase** pour permettre l'historique et le suivi de ta progression.
- Seul un **résumé statistique** de ta semaine (durée totale, moyennes) peut être envoyé à Claude (Anthropic) pour faire répondre Uma — et uniquement si tu acceptes explicitement.
- Tes messages, ton prénom, tes objectifs et ton email sont également stockés chez Supabase.
- Aucune donnée n'est vendue ni utilisée à des fins publicitaires.
- Tu peux supprimer ton compte et toutes tes données à tout moment depuis l'app (Profil → Supprimer le compte).

Pour toute question : **maxime.kirch@gmail.com**

---

## 1. Qui est responsable du traitement

Le responsable du traitement au sens du RGPD est :

**Maxime Kirch**
Personne physique, éditeur de l'application JackFit
Contact : maxime.kirch@gmail.com

JackFit est actuellement distribuée en version bêta via TestFlight.

---

## 2. Quelles données sont collectées

### 2.1 Données que tu nous fournis directement

| Donnée | Quand | Où c'est stocké |
|---|---|---|
| Adresse email | Création de compte | Supabase Auth |
| Prénom | Onboarding | Supabase (table `profiles`) |
| Sports pratiqués | Onboarding | Supabase (table `profiles`) |
| Profil athlète (débutant / régulier / intensif) | Onboarding | Supabase (table `profiles`) |
| Objectifs (activité hebdo, sommeil) | Onboarding | Supabase (table `profiles`) |
| Messages échangés avec Uma | À chaque envoi | Supabase (table `messages`) |
| Comptage quotidien des messages envoyés (pour le rate limit) | À chaque envoi | Supabase (table `chat_usage`) |
| Échantillons HealthKit (workouts, sommeil, pas) | À chaque synchro Santé | Supabase (table `health_data_raw`) |
| Historique de tes scores hebdomadaires de forme | À chaque calcul de score | Supabase (table `weekly_scores`) |
| Progression d'Uma (XP total, stade actuel) | À chaque évolution | Supabase (table `pet_progression`) |
| Historique de tes gains d'XP | À chaque gain | Supabase (table `xp_transactions`) |
| Horodatage de ton consentement IA | Au moment du consentement | Supabase (table `profiles`, champ `ai_consent_given_at`) |

### 2.2 Données lues sur ton iPhone via Apple Santé (HealthKit)

Avec ton autorisation explicite, JackFit lit **sur les 7 derniers jours** :

- Tes séances d'entraînement (type, durée, date)
- Tes échantillons de sommeil (heures d'endormissement, durée, phases)
- Ton nombre de pas quotidien

Ces échantillons sont envoyés à notre backend et **stockés dans une table Supabase dédiée**, associés à ton identifiant utilisateur. Nous conservons ces données afin de :

- calculer ton score hebdomadaire de forme et le faire évoluer dans le temps ;
- animer les états et la progression d'Uma sur plusieurs semaines ;
- alimenter la conversation avec Uma (si consentement IA) ;
- afficher l'historique de tes statistiques dans l'app.

**Ce qui est stocké côté serveur :** les samples eux-mêmes (type et durée de chaque workout, durée de chaque nuit de sommeil, nombre de pas par jour), sur une fenêtre glissante correspondant à ton historique dans l'app.

**Ce qui n'est jamais lu ni stocké :** ta fréquence cardiaque, ta pression artérielle, tes calories, tes cycles menstruels, tes données de nutrition, ni aucune autre donnée Santé non listée ci-dessus.

### 2.3 Données techniques et de diagnostic (PostHog)

Nous utilisons PostHog pour comprendre comment l'app est utilisée et détecter les bugs. Les événements collectés incluent :

- Identifiant utilisateur (l'UUID Supabase, aucune donnée nominative)
- Événements de navigation (écrans visités, sans contenu)
- Événements produit (ex. `chat_message_sent`, `xp_stage_changed`, `healthkit_sync_triggered`, `notification_permission_result`)
- Exceptions techniques (traces d'erreur applicative)

**Le contenu de tes messages, tes données Santé brutes, et ton email ne sont jamais envoyés à PostHog.**

### 2.4 Ce que nous ne collectons pas

- Ta localisation GPS
- Ton carnet de contacts
- Tes photos
- Tes fréquences cardiaques individuelles
- Tes cycles menstruels
- Toute donnée Santé non listée en 2.2
- Aucun identifiant publicitaire (IDFA)

---

## 3. À quoi servent tes données (finalités)

| Finalité | Données concernées | Base légale RGPD |
|---|---|---|
| Créer et gérer ton compte | Email | Exécution du contrat (art. 6.1.b) |
| Calculer ton score de forme et animer Uma | Résumé Santé, profil, objectifs | Exécution du contrat (art. 6.1.b) |
| Discuter avec Uma via l'IA | Messages, résumé Santé, prénom, sports | Consentement explicite (art. 6.1.a) |
| Envoyer un rappel quotidien local | Aucune donnée transmise (notification locale) | Consentement (art. 6.1.a) |
| Améliorer l'app et corriger les bugs | Événements PostHog, exceptions | Intérêt légitime (art. 6.1.f) |
| Répondre à tes demandes | Email | Exécution du contrat (art. 6.1.b) |

---

## 4. À qui tes données sont-elles transmises

JackFit ne vend et ne partage jamais tes données à des fins commerciales ou publicitaires. Nous faisons appel aux sous-traitants suivants, strictement pour faire fonctionner l'app :

### 4.1 Supabase Inc. (hébergement, base de données, authentification)

- Rôle : héberge ton compte, ton profil, tes messages, tes échantillons Santé, tes scores hebdomadaires, la progression d'Uma et l'historique de tes gains d'XP
- Siège : États-Unis
- Cadre : Data Processing Agreement conforme au RGPD, clauses contractuelles types (SCC)
- Site : https://supabase.com/privacy

### 4.2 Anthropic PBC (Claude — assistant IA d'Uma)

- Rôle : génère les réponses d'Uma dans le chat
- Siège : États-Unis
- Données transmises : ton message, l'historique récent de la conversation, ton prénom, tes sports, le résumé de ta semaine (durée d'entraînement, sommeil moyen, pas, score)
- Cadre : DPA conforme RGPD, SCC. Anthropic **ne réutilise pas** tes données pour entraîner ses modèles (Zero Data Retention par défaut sur l'API)
- Site : https://www.anthropic.com/legal/privacy
- **Ce partage n'a lieu que si tu as coché « J'accepte » sur l'écran de consentement dédié.** Tu peux retirer ton consentement à tout moment (voir section 7).

### 4.3 PostHog Inc. (analytics et détection d'erreurs)

- Rôle : agréger l'usage anonymisé et remonter les crashs
- Instance utilisée : région **États-Unis** (`us.i.posthog.com`)
- Cadre : DPA conforme RGPD, SCC
- Site : https://posthog.com/privacy

### 4.4 Apple Inc. (TestFlight, App Store, notifications push)

- Rôle : distribution de l'app, notifications
- Cadre : conditions Apple applicables
- Site : https://www.apple.com/legal/privacy/fr-ww/

### 4.5 Expo (Expo Application Services — build & OTA updates)

- Rôle : compilation de l'app et livraison des mises à jour JavaScript à distance
- Aucune donnée personnelle utilisateur n'est transmise
- Site : https://expo.dev/privacy

---

## 5. Transferts hors Union européenne

Certains sous-traitants (Supabase, Anthropic, PostHog) sont établis aux États-Unis. Ces transferts sont encadrés par :

- des **Clauses Contractuelles Types** (SCC) approuvées par la Commission européenne ;
- pour Anthropic et Supabase, le **Data Privacy Framework** (DPF) lorsqu'applicable.

Tu peux nous demander une copie des garanties mises en place à l'adresse maxime.kirch@gmail.com.

---

## 6. Combien de temps tes données sont conservées

| Donnée | Durée de conservation |
|---|---|
| Compte et profil | Jusqu'à ta demande de suppression |
| Messages du chat | Jusqu'à leur suppression manuelle (Profil → Effacer le chat) ou suppression du compte |
| Comptage journalier de messages (`chat_usage`) | Conservé jusqu'à la suppression de ton compte |
| Échantillons HealthKit (`health_data_raw`) | Conservés indéfiniment jusqu'à la suppression de ton compte |
| Scores hebdomadaires (`weekly_scores`) | Conservés indéfiniment jusqu'à la suppression de ton compte |
| Progression d'Uma et historique XP (`pet_progression`, `xp_transactions`) | Conservés indéfiniment jusqu'à la suppression de ton compte |
| Événements PostHog | 12 mois glissants (paramètre par défaut PostHog) |
| Journaux techniques du backend | 30 jours maximum |
| Sauvegardes chiffrées Supabase | 7 jours après suppression, puis effacées |

---

## 7. Tes droits (RGPD)

Tu disposes des droits suivants sur tes données personnelles :

- **Accès** : obtenir une copie de tes données
- **Rectification** : corriger tes informations (prénom, sports, objectifs — modifiables directement depuis Profil)
- **Effacement** : supprimer ton compte et l'ensemble de tes données via Profil → Supprimer le compte, ou par email
- **Portabilité** : recevoir tes données dans un format structuré et lisible par machine
- **Opposition** : t'opposer à un traitement fondé sur l'intérêt légitime
- **Retrait du consentement IA** : révocable à tout moment par email — nous désactiverons alors le chat avec Uma
- **Limitation** : demander la limitation d'un traitement

Pour exercer ces droits : **maxime.kirch@gmail.com**. Nous te répondons sous **30 jours maximum**.

Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la **CNIL** (Commission Nationale de l'Informatique et des Libertés) : https://www.cnil.fr/fr/plaintes

---

## 8. Sécurité

- Communications entre l'app et le backend en HTTPS/TLS
- Authentification via Supabase (JWT signé, session révocable)
- Base de données chiffrée au repos (AES-256)
- Accès administrateur restreint et journalisé
- Aucun mot de passe utilisateur stocké en clair
- Séparation stricte entre les environnements de test (TestFlight bêta) et de production

En cas de faille de sécurité affectant tes données, nous t'informerons dans les 72 heures conformément à l'article 33 du RGPD.

---

## 9. Enfants

JackFit n'est pas destinée aux personnes de moins de 16 ans. Nous ne collectons pas sciemment de données concernant des mineurs. Si tu penses qu'un mineur nous a transmis des données personnelles, contacte-nous à maxime.kirch@gmail.com et nous les supprimerons.

---

## 10. Cookies et traceurs

JackFit est une application mobile native et **n'utilise pas de cookies web**. Les identifiants publicitaires (IDFA) ne sont ni lus ni transmis.

---

## 11. Modifications de la politique

Nous pouvons faire évoluer cette politique. Toute modification substantielle te sera notifiée dans l'app avant sa prise d'effet. La date de dernière mise à jour figure en haut de ce document.

---

## 12. Contact

Pour toute question concernant tes données ou cette politique :

**Maxime Kirch**
Email : maxime.kirch@gmail.com

---

*Cette politique s'applique à l'application mobile JackFit distribuée sur iOS via TestFlight et l'App Store. Elle ne couvre pas les sites tiers vers lesquels l'app peut renvoyer.*
