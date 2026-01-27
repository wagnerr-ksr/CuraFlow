# CuraFlow

Webbasiertes Dienstplanungs- und Personalverwaltungssystem für Krankenhäuser und Kliniken


## Überblick

CuraFlow ist eine moderne Webanwendung zur digitalen Verwaltung von Dienstplänen, Urlaubsplanung und Personalressourcen in medizinischen Einrichtungen. Das System wurde speziell für die Anforderungen von radiologischen Abteilungen und vergleichbaren Krankenhausbereichen entwickelt, lässt sich jedoch flexibel an andere Fachabteilungen anpassen.

Die Anwendung bietet eine intuitive Oberfläche zur Planung von Schichtdiensten, Bereitschaftsdiensten und Rotationen. Durch rollenbasierte Zugriffssteuerung können Administratoren die vollständige Kontrolle über Dienstpläne und Mitarbeiterdaten ausüben, während reguläre Mitarbeiter ihre eigenen Dienste und Wunschlisten einsehen und bearbeiten können.


## Systemarchitektur

CuraFlow besteht aus zwei Hauptkomponenten:

Frontend: React-basierte Single-Page-Application mit Vite als Build-Tool. Die Benutzeroberfläche nutzt moderne UI-Komponenten auf Basis von Radix UI und Tailwind CSS für ein responsives Design, das sowohl auf Desktop- als auch auf mobilen Endgeräten funktioniert.

Backend: Node.js/Express-Server mit REST-API. Die Authentifizierung erfolgt über JWT-Token. Als Datenbank wird MySQL verwendet. Das Backend unterstützt Multi-Tenant-Betrieb, sodass mehrere Mandanten (z.B. verschiedene Abteilungen oder Standorte) über eine zentrale Installation bedient werden können.


## Technische Voraussetzungen

Server-Anforderungen:
- Node.js Version 18 oder höher
- MySQL Version 8.0 oder höher
- Mindestens 1 GB RAM für den Anwendungsserver
- Netzwerkzugriff für HTTPS-Verbindungen

Client-Anforderungen:
- Moderner Webbrowser (Chrome, Firefox, Edge, Safari in aktueller Version)
- JavaScript muss aktiviert sein
- Bildschirmauflösung von mindestens 1024x768 Pixeln empfohlen


## Hauptfunktionen

Dienstplanverwaltung (Schedule):
Die zentrale Funktion der Anwendung ermöglicht die visuelle Planung von Diensten in einer Wochen- oder Tagesansicht. Ärzte und Mitarbeiter können per Drag-and-Drop verschiedenen Arbeitsbereichen zugeordnet werden. Das System unterscheidet zwischen Anwesenheiten, Abwesenheiten (Urlaub, Krank, Frei, Dienstreise), Diensten (Vordergrund, Hintergrund, Spätdienst) sowie Rotationen und Spezialbereichen (CT, MRT, Sonographie, Angiographie, Mammographie etc.). Die Konfiguration der Arbeitsbereiche ist vollständig anpassbar.

Mitarbeiterverwaltung (Staff):
Verwaltung aller Ärzte und Mitarbeiter mit ihren Stammdaten. Jeder Mitarbeiter kann einer Rolle zugeordnet werden (Chefarzt, Oberarzt, Facharzt, Assistenzarzt, Nicht-Radiologe). Die Reihenfolge der Anzeige ist konfigurierbar. Es können Qualifikationen und Einschränkungen hinterlegt werden.

Stellenplan (Staffing Plan):
Erfassung des Beschäftigungsumfangs (VK-Anteil) je Mitarbeiter und Monat. Berücksichtigung von Kündigungsfristen, Mutterschutz, Elternzeit und anderen Abwesenheitsgründen. Diese Informationen fließen in die automatische Berechnung der Verfügbarkeit ein.

Urlaubsplanung (Vacation):
Jahresübersicht für jeden Mitarbeiter mit Anzeige von Urlaubstagen, Schulferien und Feiertagen. Automatische Berücksichtigung von Konflikten bei der Urlaubsplanung. Synchronisation mit dem Dienstplan.

Wunschliste (WishList):
Mitarbeiter können Wünsche für bestimmte Dienste oder dienstfreie Tage eintragen. Administratoren sehen eine Übersicht aller Wünsche und können diese bei der Dienstplanung berücksichtigen. Das System protokolliert die Erfüllungsquote der Wünsche.

Statistiken (Statistics):
Auswertungen über die Verteilung von Diensten, Rotationen und Abwesenheiten. Grafische Darstellung als Balkendiagramme und Tabellen. Export-Möglichkeit der Daten. Wunscherfüllungsberichte und Compliance-Reports.

Administration (Admin):
Zentrale Verwaltungsoberfläche für Systemadministratoren. Benutzerverwaltung mit Rollen und Berechtigungen. Datenbank-Wartungsfunktionen. Systemprotokollierung. Einstellungen für Farbschemata, Abschnittskonfiguration und weitere Anpassungen.


## Sicherheit und Datenschutz

Die Anwendung implementiert folgende Sicherheitsmaßnahmen:

- Authentifizierung über JWT-Token mit konfigurierbarer Gültigkeitsdauer
- Passwörter werden mit bcrypt gehasht und niemals im Klartext gespeichert
- HTTPS-Verschlüsselung für alle Verbindungen (bei korrekter Server-Konfiguration)
- Rollenbasierte Zugriffskontrolle (Admin, User, Read-Only)
- Rate-Limiting zum Schutz vor Brute-Force-Angriffen
- Helmet-Middleware für HTTP-Security-Header
- Mandantenspezifische Datenbanktrennung bei Multi-Tenant-Betrieb

Für den Betrieb in Krankenhausumgebungen wird empfohlen:
- Betrieb hinter einem Reverse-Proxy mit SSL-Terminierung
- Regelmäßige Datensicherung der MySQL-Datenbank
- Integration in das vorhandene Netzwerk- und Firewall-Konzept
- Prüfung der Kompatibilität mit lokalen Datenschutzrichtlinien


## Installation und Deployment

Die Anwendung kann auf verschiedenen Plattformen betrieben werden:

Lokale Installation:
1. Repository klonen
2. Dependencies installieren mit npm install im Hauptverzeichnis und im server-Verzeichnis
3. Umgebungsvariablen konfigurieren (siehe Abschnitt Konfiguration)
4. MySQL-Datenbank einrichten und Migrationen ausführen
5. Frontend bauen mit npm run build
6. Server starten mit npm start im server-Verzeichnis

Cloud-Deployment (Railway):
Die Anwendung ist für das Deployment auf Railway optimiert. Detaillierte Anleitungen finden sich in den Dateien RAILWAY_DEPLOYMENT.md und RAILWAY_QUICKSTART.md. Railway bietet eine einfache Möglichkeit, sowohl das Frontend als auch das Backend inklusive MySQL-Datenbank zu hosten.

Docker:
Ein Dockerfile ist im Repository enthalten und ermöglicht den Betrieb in Container-Umgebungen.


## Konfiguration

Die Anwendung wird über Umgebungsvariablen konfiguriert:

MYSQL_HOST: Hostname des MySQL-Servers
MYSQL_PORT: Port des MySQL-Servers (Standard: 3306)
MYSQL_USER: Datenbankbenutzer
MYSQL_PASSWORD: Datenbankpasswort
MYSQL_DATABASE: Name der Datenbank
JWT_SECRET: Geheimer Schlüssel für die JWT-Signierung (mindestens 32 Zeichen)
PORT: Port für den Express-Server (Standard: 3000)

Optionale Variablen für erweiterte Funktionen:
ENCRYPTION_KEY: Schlüssel für die Verschlüsselung von Mandanten-Datenbankzugangsdaten
GOOGLE_CALENDAR_CREDENTIALS: Zugangsdaten für Google Calendar Integration
OPENAI_API_KEY: API-Schlüssel für KI-gestützte Funktionen


## Datenmodell

Die Anwendung verwendet folgende Haupttabellen:

app_users: Benutzerkonten mit Authentifizierungsdaten und Einstellungen
doctors: Mitarbeiterstammdaten (Ärzte und sonstiges Personal)
shift_entries: Einzelne Dienstplaneinträge mit Datum, Person und Position
workplaces: Konfigurierbare Arbeitsbereiche und Dienste
wish_requests: Dienstwünsche der Mitarbeiter
color_settings: Anpassbare Farbschemata für Rollen und Abwesenheiten
system_settings: Globale Systemeinstellungen
staffing_plan_entries: Stellenplaneinträge pro Mitarbeiter und Zeitraum
team_roles: Konfigurierbare Rollen und deren Hierarchie

Die Tabellenstruktur kann über die SQL-Migrationen im Verzeichnis server/migrations angepasst werden.


## Schnittstellen und Integrationen

REST-API:
Alle Funktionen sind über eine dokumentierte REST-API erreichbar. Die API verwendet JSON als Datenaustauschformat. Authentifizierung erfolgt über Bearer-Token im Authorization-Header.

Kalender-Synchronisation:
Optionale Integration mit Google Calendar zur automatischen Synchronisation von Diensten.

Excel-Export:
Dienstpläne können als Excel-Dateien exportiert werden zur Weitergabe oder Archivierung.


## Wartung und Support

Datenbank-Backup:
Regelmäßige Backups der MySQL-Datenbank werden dringend empfohlen. Die Anwendung selbst speichert keine persistenten Daten außerhalb der Datenbank.

Logging:
Das Backend protokolliert Zugriffe und Fehler. Die Logs können über die Admin-Oberfläche eingesehen werden.

Updates:
Bei Updates sollte zunächst ein Backup erstellt werden. Anschließend können die neuen Dateien eingespielt und eventuell erforderliche Datenbankmigrationen ausgeführt werden.


## Technologie-Stack

Frontend:
- React 18 mit Vite
- TanStack Query für Datenverwaltung
- Tailwind CSS für Styling
- Radix UI für Basiskomponenten
- date-fns für Datumsberechnungen
- Recharts für Diagramme

Backend:
- Node.js mit Express
- MySQL mit mysql2-Treiber
- JWT für Authentifizierung
- bcrypt für Passwort-Hashing
- Helmet für Security-Header
- express-rate-limit für Anfragebegrenzung


## Lizenz und Haftung

Diese Software wird ohne Gewährleistung bereitgestellt. Der Einsatz in produktiven Umgebungen erfolgt auf eigene Verantwortung. Vor dem produktiven Einsatz sollte eine umfassende Prüfung der Sicherheits- und Datenschutzanforderungen der jeweiligen Einrichtung erfolgen.


## Kontakt und Weiterentwicklung

Das Projekt wird aktiv weiterentwickelt. Für Fragen zur Implementierung, Anpassungen oder Integration in bestehende Krankenhausinfrastrukturen kann der Entwickler kontaktiert werden.

Repository: https://github.com/andreasknopke/CuraFlow
