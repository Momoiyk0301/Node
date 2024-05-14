//MODULE EXTERNE------------------------------------------
const express  = require('express');
const mysql    = require('mysql2');
const path     = require('path');
//?mysql2

//MODULE INTERNE------------------------------------------
const dbConfig = require('./config');
const app      = express();
const port     = 3000;


// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection(dbConfig);

// Connexion à la base de données
db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    process.exit(1);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

//middleware----------------------------
app.use(express.json());

//FONCTION----------------
// Fonction générique pour récupérer les données depuis la base de données
function getDataFromDB(sql, res) {
  db.query(sql, (err, resultats) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur du serveur' });
    } else {
      res.json(resultats);
    }
  });
}

// ROUTE API------------------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre API');
});


//--------INTERACTION STOCK
// Route pour récupérer les données depuis la Table STOCK
app.get('/stock', (req, res) => {
  const sql = 'SELECT * FROM stock';
  getDataFromDB(sql, res)

});

// Route pour insérer des données dans la table STOCK
app.post('/stock/add', (req, res) => {
  const { name, unite, prix, prix_de_vente } = req.body;

  // Vérifie si toutes les données nécessaires sont présentes
  if (!name || !unite || !prix || !prix_de_vente) {
    return res.status(400).json({ error: 'Toutes les données sont requises' });
  }

  const sql = 'INSERT INTO stock (name, unite, prix, `prix de vente`) VALUES (?, ?, ?, ?)';
  const values = [name, unite, prix, prix_de_vente];
   // Exécutez la requête SQL d'insertion directement avec db.query
   db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête d\'insertion :', err);
      res.status(500).json({ error: 'Erreur du serveur' });
    } else {
      res.json({ message: 'Données insérées avec succès', insertedId: result.insertId });
    }
  });
});

// Route pour supprimer un élément de la table STOCK
app.delete('/stock/delete/:id', (req, res) => {
  const itemId = req.params.id;

  // Vérifie si l'ID est fourni
  if (!itemId) {
    return res.status(400).json({ error: 'L\'ID de l\'élément est requis' });
  }

  const sql = 'DELETE FROM stock WHERE id = ?';

  // Exécutez la requête SQL avec l'ID fourni
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête de suppression :', err);
      res.status(500).json({ error: 'Erreur du serveur' });
    } else {
      // Vérifie si l'élément a été supprimé
      if (result.affectedRows > 0) {
        res.json({ message: 'Élément supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Élément non trouvé' });
      }
    }
  });
});

//---------INTERACTION EDL-------


// Route pour récupérer les données depuis la Table STOCK
app.get('/edl', (req, res) => {
  const sql = 'SELECT * FROM etatsdeslieux';
  getDataFromDB(sql, res)

});


// Route pour insérer des données dans la table STOCK
app.post('/edl/add', (req, res) => {
  const { equipe_id, type, unite_fut1, unite_fut2, nombre_verre} = req.body;

  // Vérifie si toutes les données nécessaires sont présentes
  if (!equipe_id || !type || !unite_fut1 || !unite_fut2 ||!nombre_verre) {
    return res.status(400).json({ error: 'Toutes les données sont requises' });
  }
  const date_creation  = new Date().toISOString().split('T')[0];
  const heure_creation = new Date().toLocaleTimeString;

  const sql = 'INSERT INTO etatsdeslieux (equipe_id, type, unite_fut1, unite_fut2, nombre_verre, date_creation, heure_creation) VALUES (?, ?, ?, ?, ?, ?, ?)';

  const values = [equipe_id, type, unite_fut1, unite_fut2, nombre_verre, date_creation, heure_creation];

  // Exécutez la requête SQL d'insertion directement avec db.query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête d\'insertion :', err);
      res.status(500).json({ error: 'Erreur du serveur' });
    } else {
      res.json({ message: 'Données insérées avec succès', insertedId: result.insertId });
    }
  });
});




// Route pour récupérer les rapports d'états des lieux
app.get('/rapport_edl', (req, res) => {
  const sql = 'SELECT * FROM rapport_edl';
  getDataFromDB(sql, res)

});









//---------INTERACTION TEAM-------

// Route pour récupérer les données depuis la table TEAM
app.get('/equipe', (req, res) => {
  const sql = 'SELECT * FROM equipe';
  getDataFromDB(sql, res)
});

app.post('/equipe/add', (req, res) => {
  const { name_equipe, contact, mail} = req.body;
  // Vérifie si toutes les données nécessaires sont présentes
  if (!name_equipe || !contact || !mail) {
    return res.status(400).json({ error: 'Toutes les données sont requises' });
  }

  const sql = 'INSERT INTO equipe (name_equipe, contact, mail) VALUES (?, ?, ?)';
  const values = [name_equipe, contact, mail];
  console.log('Données reçues sur le serveur', req.body)
   // Exécutez la requête SQL d'insertion directement avec db.query
   db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête d\'insertion :', err);
      res.status(500).json({ error: 'Erreur du serveur' });
    } else {
      res.json({ message: 'Données insérées avec succès', insertedId: result.insertId });
    }
  });
});

app.get('/equipe/nom/:id', (req, res) => {
  const equipeId = req.params.id;
  const sql = 'SELECT name_equipe FROM equipe WHERE id = ?';

  db.query(sql, [equipeId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur du serveur' });
    } else {
      if (result.length > 0) {
        const equipeName = result[0].name_equipe;
        res.json({ equipeName: equipeName });
      } else {
        res.status(404).json({ error: 'Équipe non trouvée' });
      }
    }
  });
});







// Route pour récupérer la somme des futs
app.get('/stock/total_unite', (req, res) => {
  const sql = 'SELECT SUM(unite) AS total FROM stock';
  getDataFromDB(sql, res)
});

// Route pour récupérer les chiffres d'affaires
app.get('/stock/total_CA', (req, res) => {
  const sql = 'SELECT SUM(`prix de vente` * unite) AS total_CA FROM stock';
  getDataFromDB(sql, res)
});


app.post('/stock/add', (req, res) => {
  const { name, unite, prix, prix_de_vente } = req.body;

  // Vérifie si toutes les données nécessaires sont présentes
  if (!name || !unite || !prix || !prix_de_vente) {
    return res.status(400).json({ error: 'Toutes les données sont requises' });
  }

  const sql = 'INSERT INTO stock (name, unite, prix, `prix de vente`) VALUES (?, ?, ?, ?)';

  const values = [name, unite, prix, prix_de_vente];

  // Exécutez la requête SQL
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête d\'insertion :', err);
      res.status(500).json({ error: 'Erreur du serveur' });
    } else {
      res.json({ message: 'Données insérées avec succès', insertedId: result.insertId });
    }
  });
});




// Définir le dossier public pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Démarrez le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
