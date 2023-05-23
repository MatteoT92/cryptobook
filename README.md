# CryptoBook

CryptoBook è un social network che permette di scambiare e crittografare i messaggi/posts.

## Tecnologie usate

**Front-end:** React, Bootstrap

**Back-end:** Node, Express

**Database:** MongoDB, Mongoose

**Version Control System:** Git
## Prerequisiti

Aver installato i seguenti software:

- [Node.js](https://nodejs.org/it/download)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git Bash](https://git-scm.com/)
- [Postman](https://www.postman.com/downloads/) (opzionale)

## Installazione

Scarica il progetto

```bash
  git clone https://github.com/MatteoT92/cryptobook.git
```

Installa le dipendenze richieste dal server e client

```bash
  cd backend
  npm install
```

```bash
  cd frontend/cryptobook
  npm install
```

Avvia il server

```bash
  cd backend
  npm start
```

Avvia il client

```bash
  cd frontend/cryptobook
  npm start
```


## Esecuzione nel browser

Per testare la web-app occorre andare sul browser e digitare il seguente URL

```http
  http://localhost:3000/
```


## Descrizione API

Nel caso vogliate testare le API, costruite per far funzionare l'applicazione, potete utilizzare **Postman** ed effettuare le varie chiamate che desiderate testare.

#### Effettua il login

```http
  POST http://localhost:5000/login
```

| Parametri | Tipo     | Descrizione                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Obbligatorio**. Username |
| `password` | `string` | **Obbligatorio**. Password |

#### Effettua l'iscrizione

```http
  POST http://localhost:5000/sign
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Obbligatorio**. Username |
| `email`      | `string` | **Obbligatorio**. E-mail |
| `password`      | `string` | **Obbligatorio**. Password |
| `photo`      | `string` | **Obbligatorio**. Stringa Base64 Immagine Foto profilo |

#### Ricerca foto profilo dell'utente

```http
  GET http://localhost:5000/api/photo?username=:username
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Obbligatorio**. Username |

#### Ricerca i messaggi scambiati fra due utenti

```http
  GET http://localhost:5000/api/messages?user=:user&friend=:friend
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |
| `friend`      | `string` | **Obbligatorio**. Utente amico con cui avviene la chat |

#### Effettua la crittografia del messaggio da inviare

```http
  POST http://localhost:5000/api/msg/encrypt
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `message`      | `string` | **Obbligatorio**. Messaggio da inviare |
| `key`      | `string` | **Obbligatorio**. Chiave segreta per crittografare il messaggio |

#### Effettua la crittografia del post da inviare

```http
  POST http://localhost:5000/api/post/encrypt
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `message`      | `string` | **Obbligatorio**. Post da inviare |
| `key`      | `string` | **Obbligatorio**. Chiave segreta per crittografare il post |

#### Effettua la crittografia del commento al post da inviare

```http
  POST http://localhost:5000/api/comment/encrypt
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `message`      | `string` | **Obbligatorio**. Commento da inviare |
| `key`      | `string` | **Obbligatorio**. Chiave segreta per crittografare il commento |

#### Effettua la decrittografia del messaggio inviato/ricevuto

```http
  POST http://localhost:5000/api/msg/decrypt
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `message`      | `string` | **Obbligatorio**. Messaggio inviato/ricevuto |
| `key`      | `string` | **Obbligatorio**. Chiave segreta per decrittografare il messaggio |

#### Effettua la decrittografia del post inviato/ricevuto

```http
  POST http://localhost:5000/api/post/decrypt
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `message`      | `string` | **Obbligatorio**. Post inviato/ricevuto |
| `key`      | `string` | **Obbligatorio**. Chiave segreta per decrittografare il post |

#### Effettua la decrittografia del commento al post inviato/ricevuto

```http
  POST http://localhost:5000/api/comment/decrypt
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `message`      | `string` | **Obbligatorio**. Commento inviato/ricevuto |
| `key`      | `string` | **Obbligatorio**. Chiave segreta per decrittografare il commento |

#### Effettua l'invio del messaggio in chat

```http
  POST http://localhost:5000/api/msg/send
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `sender`      | `string` | **Obbligatorio**. Utente loggato |
| `receiver`      | `string` | **Obbligatorio**. Utente amico con cui avviene la chat |
| `message`      | `string` | **Obbligatorio**. Messaggio da inviare |

#### Effettua l'invio e pubblicazione del post

```http
  POST http://localhost:5000/api/post/send
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `author`      | `string` | **Obbligatorio**. Utente loggato |
| `content`      | `string` | **Obbligatorio**. Messaggio da postare |

#### Effettua l'invio e pubblicazione del commento al post

```http
  POST http://localhost:5000/api/comment/send
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `idPost`      | `string` | **Obbligatorio**. Riferimento del post |
| `author`      | `string` | **Obbligatorio**. Utente loggato |
| `content`      | `string` | **Obbligatorio**. Messaggio di commento al post |

#### Ricerca tutti i post in cui un utente è abilitato a visualizzare

```http
  GET http://localhost:5000/api/posts?user=:user
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |

#### Ricerca tutti i post pubblicati da un utente

```http
  GET http://localhost:5000/api/posts/:user
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |

#### Ricerca tutti gli amici di un utente

```http
  GET http://localhost:5000/api/friends?user=:user
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |

#### Effettua l'inserimento di un utente come amico

```http
  POST http://localhost:5000/api/friends
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |
| `friend`      | `string` | **Obbligatorio**. Username utente da aggiungere come amico |

#### Effettua il cambio della password

```http
  POST http://localhost:5000/api/settings/password
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Obbligatorio**. Username Utente loggato |
| `oldPassword`      | `string` | **Obbligatorio**. Password attuale |
| `newPassword`      | `string` | **Obbligatorio**. Nuova Password |

#### Effettua il cambio della foto profilo

```http
  POST http://localhost:5000/api/settings/photo
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Obbligatorio**. Username Utente loggato |
| `photo`      | `string` | **Obbligatorio**. Stringa Base64 Immagine Foto |

#### Effettua la disiscrizione

```http
  DELETE http://localhost:5000/api/settings/unsubscribe
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Obbligatorio**. Username Utente loggato |

#### Effettua la ricerca degli utenti iscritti a cui richiedere l'amicizia

```http
  GET http://localhost:5000/api/users?exclude=:user
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |

#### Effettua la richiesta di amicizia ad un utente

```http
  POST http://localhost:5000/api/users
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `sender`      | `string` | **Obbligatorio**. Utente loggato |
| `receiver`      | `string` | **Obbligatorio**. Username utente a cui richiedere l'amicizia |

#### Effettua la ricerca di tutte le richieste di amicizia inviate da un utente

```http
  GET http://localhost:5000/api/users/:user/followrequests/sended
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |

#### Effettua la rimozione di una richiesta di amicizia inviata da un utente

```http
  DELETE http://localhost:5000/api/users/:user/followrequests/sended
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |
| `friend`      | `string` | **Obbligatorio**. Username utente di cui rimuovere la richiesta di amicizia |

#### Effettua la ricerca di tutte le richieste di amicizia ricevute da un utente

```http
  GET http://localhost:5000/api/users/:user/followrequests/received
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |

#### Effettua l'accettazione di una richiesta di amicizia ricevuta da un utente

```http
  POST http://localhost:5000/api/users/:user/followrequests/received
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |
| `friend`      | `string` | **Obbligatorio**. Username utente di cui accettare la richiesta di amicizia |

#### Effettua la rimozione di una richiesta di amicizia ricevuta da un utente

```http
  DELETE http://localhost:5000/api/users/:user/followrequests/received
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |
| `friend`      | `string` | **Obbligatorio**. Username utente di cui rimuovere la richiesta di amicizia |

#### Effettua la ricerca dello username di un id utente

```http
  GET http://localhost:5000/api/users/:user
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Riferimento Utente |

#### Effettua dei controlli sul parametro "friend" per verificare se lo username è già presente come amico, richiesta inviata e richiesta ricevuta

```http
  GET http://localhost:5000/api/users/:user/:friend
```

| Parametri | Tipo     | Descrizione                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Obbligatorio**. Utente loggato |
| `friend`      | `string` | **Obbligatorio**. Username utente di cui effettuare i controlli |

## Autore:
Matteo Tartaglione
## 🔗 Links
[![github](https://img.shields.io/github/followers/MatteoT92?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MatteoT92)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matteotartaglione/)