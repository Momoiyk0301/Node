//GESTION DES DONNEES--------------------------------------------------
async function fetchData(apiEndpoint) {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        console.log(`Données de ${apiEndpoint} récupérées`, data);
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données depuis l'API ${apiEndpoint} :`, error);
    }
}

// Recup les données depuis table EDL
async function fetchDataEDL() {
    return await fetchData('/edl');
}

// Recup les données depuis table RAPPORT_EDL
async function fetchDataRAPPORT() {
    return await fetchData('/rapport_edl');
}

// Recup les données depuis table EQUIPE
async function fetchDataEquipe() {
    return await fetchData('/equipe');
}

// Recup les données depuis table STOCK
async function fetchDataStock() {
    return await fetchData('/stock');
}

// Fonction pour récupérer la SOMME DES UNITES DE FUTS
async function fetchTotalUniteStock() {
    try {
        const response = await fetch('/stock/total_unite');
        const totalUniteStock = await response.json();
        console.log('Sommes des futs recup', totalUniteStock)
        return totalUniteStock[0].total; // La somme sera dans la propriété 'total' du résultat
    } catch (error) {
        console.error('Erreur lors de la récupération de la somme des unités de fûts depuis l\'API :', error);
        throw error; // Propage l'erreur pour qu'elle puisse être traitée à l'endroit approprié
    }
}

// Fonction pour récupérer la somme du chiffre d'affaires (CA)
async function fetchTotalCA() {
    try {
        const response = await fetch('/stock/total_CA');
        const totalCA = await response.json();
        console.log('Chiffre d\'affaire', totalCA)
        return totalCA[0].total_CA; // La somme du chiffre d'affaires sera dans la propriété 'total_CA' du résultat
    } catch (error) {
        console.error('Erreur lors de la récupération du total du chiffre d\'affaires depuis l\'API :', error);
        throw error; // Propage l'erreur pour qu'elle puisse être traitée à l'endroit approprié
    }
}

// Fonction pour récupérer le nom d'equipe

async function getTeamNameById(teamId) {
    try {
      const response = await fetch(`/equipe/nom/${teamId}`);
      const data = await response.json();
  
      if (response.ok) {
        const equipeName = data.equipeName;
        console.log(`Nom de l'équipe avec l'ID ${teamId} : ${equipeName}`);
        return equipeName;
      } else {
        console.error(`Erreur : ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données du serveur', error);
    }
  }

// Appel de la fonction pour récupérer les données dès que la page est chargée
async function fetchAllData(){
    try {
        const data_stock = await fetchDataStock();
        const data_team = await fetchDataTeam();
    } catch (error) {
        console.error('Erreur lors de la recupération des données', error)
    }
}

//AFFICHAGE PAGE HOME----------------------------------------------------
// Mise à jour de la fonction Home()
async function Home() {
    const content = document.getElementById('content');

    // Mise à zéro du dashboard
    if (content.childElementCount > 0) {
        content.innerHTML = "";   
    }

    // Création des éléments
    const section   = document.createElement('div');
    const title     = document.createElement('h1');
    const DataCA    = document.createElement('div');
    const DataFut   = document.createElement('div');
    const DataEDL   = document.createElement('div')
    const numberCA  = document.createElement('h2');
    const numberFut = document.createElement('h2');

    // Actualisation du titre
    title.textContent = "Accueil";

    try {
        // Récupération de la somme des unités de fûts
        const totalUniteStock = await fetchTotalUniteStock();
        const totalCA         = await fetchTotalCA();

        // Mise à jour des données
        numberFut.innerHTML = `<h2>${totalUniteStock} Fûts</h2><h3>80 Fûts pils</h3><h3>41 Fûts spéciales<h3></h3>`;
        numberCA.innerHTML = `<h2>${totalCA} €</h2><h3>10 000 € Pils</h3><h3>5000 € Spéciales</h3>`;
        DataEDL.innerHTML  = `<h2> XX Etats des lieux faits</h2>`

        // Ajout des éléments
        DataCA.appendChild(numberCA);
        DataFut.appendChild(numberFut);
        section.appendChild(title);
        section.appendChild(DataCA);
        section.appendChild(DataFut);
        section.appendChild(DataEDL)

        //ajout des classes
        section.classList.add('HOME_CONTAINER');
        DataCA.classList.add('dataContainer');
        DataFut.classList.add('dataContainer');
        DataEDL.classList.add('data-container');
        content.appendChild(section);

    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données pour la page Home :', error);
    }
}




//AFFICHAGE PAGE STOCK-------------------------------------------
function Stock(data_stock) {
    const content = document.getElementById('content')
  
    //Mise à zéro du tableau
    if (content.childElementCount > 0) {
      content.innerHTML = "";
    }
  
    //Création des éléments
    const section        = document.createElement('div')
    const title          = document.createElement('h1')
    const table          = document.createElement('table')
    const buttonNew      = document.createElement("button")
    const buttonDelete   = document.createElement("button")
    const buttonUpdate   = document.createElement('button')
    const section_button = document.createElement('div')

   
    
    // Créer une ligne d'en-tête pour le tableau
    const headerRow = table.insertRow(0);
    const headerNames = ['Nom', 'Unité', 'Prix', 'Prix de vente']; // Remplacez ces noms par ceux que vous souhaitez

    headerNames.forEach(name => {
    const th = document.createElement('th');
    th.textContent = name;
    headerRow.appendChild(th);
    });


    // Ajouter les lignes de données au tableau
    data_stock.forEach(item => {
      const row = table.insertRow();
      Object.values(item).forEach(value => {
        const cell = row.insertCell();
        cell.textContent = value;
      });
  
      // Ajouter un écouteur d'événements pour détecter le clic sur la ligne
      row.addEventListener('click', function () {
        // Vérifier si la ligne est déjà sélectionnée
        const isSelected = row.classList.contains("selected-row");
  
        // Retire la classe "selected-row" de toutes les lignes
        const rows = table.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
          rows[i].classList.remove("selected-row");
        }
  
        // Si la ligne n'était pas déjà sélectionnée, ajoute la classe "selected-row"
        if (!isSelected) {
          row.classList.add("selected-row");
  
          // Vous pouvez maintenant utiliser la ligne sélectionnée dans d'autres fonctions
          // Par exemple, accéder aux données de la ligne :
          const selectedData = Object.values(item);
          console.log("Données de la ligne sélectionnée :", selectedData);
        }
      });
    });
  
    // Modification des éléments
    title.textContent       = "Stock"
    section_button.classList.add("button_bar")
    buttonNew.classList.add("button2")
    buttonDelete.classList.add('button2')
    buttonUpdate.classList.add('button2')

   
    buttonNew.textContent    = "Nouveau"
    buttonDelete.textContent = "Suppression"
    buttonUpdate.textContent = "Modification"
  
    //Section button
    section_button.appendChild(buttonNew)
    section_button.appendChild(buttonDelete)
    section_button.appendChild(buttonUpdate)

    section.appendChild(title)
    section.appendChild(section_button)
    section.appendChild(table)
    section.classList.add('STOCK_CONTAINER')
    content.appendChild(section)

    //bouton modification
    buttonNew.addEventListener('click', function(){

        sendDataToApi()
        //------INSERTION DELEMENT------
        function sendDataToApi() {
            section.removeChild(table)
            section.removeChild(section_button)
            title.textContent = "Nouveau produit"
            // Création du formulaire
            const form = document.createElement('form');
            const window = document.createElement('div');
            const popup = document.getElementById('popup');
            form.id = 'myForm';

            // Liste des champs du formulaire
            const fields = [
                { label: 'Nom:', type: 'text', id: 'name', name: 'name', required: true },
                { label: 'Unité:', type: 'number', id: 'unite', name: 'unite', required: true },
                { label: 'Prix:', type: 'number', id: 'prix', name: 'prix', required: true },
                { label: 'Prix de vente:', type: 'number', id: 'prix_de_vente', name: 'prix_de_vente', required: true }
            ];
        
            // Ajouter les champs au formulaire
            fields.forEach(field => {
                const label = document.createElement('label');
                label.textContent = field.label;
        
                const input = document.createElement('input');
                input.type = field.type;
                input.id = field.id;
                input.name = field.name;
                if (field.required) {
                    input.required = true;
                }
        
                label.setAttribute('for', field.id);

                // Ajouter les éléments au formulaire
                form.appendChild(label);
                form.appendChild(input);
            });

        
            // Ajouter un bouton de soumission et de retour
            const submitButton = document.createElement('button');
            const exitButton   = document.createElement('button') 

            submitButton.type = 'button';
            submitButton.textContent = 'Envoyer';
            exitButton.textContent   = "Annuler";
            submitButton.classList   = 'button2';
            exitButton.classList     = 'button2'; 

            submitButton.addEventListener('click', () => submitForm());
            

            exitButton.addEventListener('click', function() {
                // Supposons que fetchDataStock() soit une fonction qui récupère les données du stock
                fetchDataStock().then(data_stock => {
                    Stock(data_stock);
                }).catch(error => {
                    console.error('Erreur lors de la récupération des données :', error);
                });
            });

            // Ajouter le bouton au formulaire
            form.appendChild(submitButton);
            form.appendChild(exitButton)


            // Ajouter le formulaire au document
            window.appendChild(form)
            section.appendChild(window)
        };
        // Fonction pour soumettre le formulaire
function submitForm() {
    const form = document.getElementById('myForm');

    // Récupérer les données du formulaire
    const formData = new FormData(form);

    // Créer un objet JSON à partir des données du formulaire
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    // Envoyer les données à l'API
    fetch('/stock/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Réponse de l\'API :', data);
        // Réinitialiser le formulaire après l'envoi des données
        form.reset();

        fetchDataStock().then(data_stock=> {
            Stock(data_stock);
        }).catch(error => {
            console.error('Erreur lors de la récupération des données')
        });
    })
    .catch(error => console.error('Erreur lors de l\'envoi des données à l\'API :', error));
}    
    })
// Ajouter un gestionnaire d'événements pour le bouton de suppression
buttonDelete.addEventListener('click', function () {
    // Trouver la ligne sélectionnée
    const selectedRow = table.querySelector('.selected-row');

    // Vérifier si une ligne est sélectionnée
    if (selectedRow) {
      // Extraire l'ID de la ligne sélectionnée (assumant que l'ID est dans la première cellule de la ligne)
      const itemId = selectedRow.cells[0].textContent;

      // Faire une requête DELETE à l'API pour supprimer l'élément
      fetch(`/stock/delete/${itemId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'élément');
        }
        return response.json();
      })
      .then(data => {
        // Suppression réussie, actualiser l'affichage ou effectuer toute autre action nécessaire
        console.log(data.message);
        selectedRow.parentNode.removeChild(selectedRow)
        // Actualiser la page, rafraîchir le tableau, etc.
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de l\'élément :', error);
        // Gérer les erreurs, afficher un message à l'utilisateur, etc.
      });
    } else {
      // Aucune ligne sélectionnée, afficher un message ou gérer de manière appropriée
      console.warn('Aucune ligne sélectionnée pour la suppression.');
    }
  });

}

// Ajouter un gestionnaire d'événements au clic sur l'élément HTML
document.addEventListener('DOMContentLoaded', function() {
    const stockButton = document.getElementById('stock-button');
    stockButton.addEventListener('click', function() {
        // Supposons que fetchDataStock() soit une fonction qui récupère les données du stock
        fetchDataStock().then(data_stock => {
            Stock(data_stock);
        }).catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
        });
    });
});





//AFFICHAGE PAGE TEAM----------------------------------------------------
async function Team() {
    const content = document.getElementById('content');

    // Mise à zéro du dashboard
    if (content.childElementCount > 0) {
        content.innerHTML = "";
    }

    const data_equipe = await fetchDataEquipe();
    
    const section = document.createElement('div');
    const title = document.createElement('h1');
    const table = document.createElement('table');
    const section_button = document.createElement('div');
    const buttonModif = document.createElement("button");
    const buttonDelete = document.createElement("button");

    // Configuration du titre
    title.textContent = "Team";
    section.appendChild(title);
    section.classList.add('STOCK_CONTAINER');
    content.appendChild(section);

    // Créer une ligne d'en-tête pour le tableau
    const headerRow = table.insertRow(0);
    const headerNames = ['ID', 'Nom', 'GSM', 'Email'];

    headerNames.forEach(name => {
        const th = document.createElement('th');
        th.textContent = name;
        headerRow.appendChild(th);
    });

    // Ajouter les lignes de données au tableau
    data_equipe.forEach(item => {
        const row = table.insertRow();
        Object.values(item).forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });

        // Ajouter un écouteur d'événements pour détecter le clic sur la ligne
        row.addEventListener('click', function () {
            const isSelected = row.classList.contains("selected-row");

            const rows = table.getElementsByTagName("tr");
            for (let i = 0; i < rows.length; i++) {
                rows[i].classList.remove("selected-row");
            }

            if (!isSelected) {
                row.classList.add("selected-row");
                const selectedData = Object.values(item);
                console.log("Données de la ligne sélectionnée :", selectedData);
            }
        });
    });

    // Configuration des éléments de modification
    title.textContent = "Equipe";
    buttonModif.classList.add("button2");
    buttonDelete.classList.add('button2');
    buttonModif.id = 'modif';
    buttonDelete.id = 'delete';
    buttonModif.textContent = "Nouveau";
    buttonDelete.textContent = "Suppression";

    // Ajout des éléments à la page
    section_button.appendChild(buttonModif);
    section_button.appendChild(buttonDelete);
    section.appendChild(title);
    section.appendChild(section_button);
    section.appendChild(table);
    section.classList.add('STOCK_CONTAINER');
    content.appendChild(section);

    // Ajout d'un gestionnaire d'événements pour le bouton "Nouveau"
    buttonModif.addEventListener('click',sendDataToApi);

    // Fonction pour envoyer les données à l'API
    function sendDataToApi() {
        section.removeChild(table);
        section.removeChild(section_button);
        title.textContent = "Nouvelle team";
    
        // Création du formulaire
        const form = document.createElement('form');
        const window = document.createElement('div');
        form.id = 'myForm';
    
        // Liste des champs du formulaire
        const fields = [
            { label: 'Name:', type: 'text', id: 'name', name: 'name', required: true },
            { label: 'Contact:', type: 'text', id: 'contact', name: 'contact', required: true },
            { label: 'Email:', type: 'text', id: 'email', name: 'email', required: true },
        ];
    
        // Ajout des champs au formulaire
        fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.label;
    
            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.name = field.name;
            if (field.required) {
                input.required = true;
            }
    
            label.setAttribute('for', field.id);
    
            // Ajout des éléments au formulaire
            form.appendChild(label);
            form.appendChild(input);
        });
    
        // Ajout des boutons de soumission et d'annulation
        const submitButton       = document.createElement('button');
        const exitButton         = document.createElement('button');
    
        submitButton.type        = 'button';
        submitButton.textContent = 'Envoyer';
        exitButton.textContent   = 'Annuler';
        submitButton.classList   = 'button2';
        exitButton.classList     = 'button2';
    
        submitButton.addEventListener('click', () => submitForm(form));
    
        exitButton.addEventListener('click', async function() {
            const data_equipe = await fetchDataEquipe();
            fetchDataEquipe().then(data_equipe => {
                Stock(data_equipe);
            }).catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
            });
        });
    
        // Ajout des boutons au formulaire
        form.appendChild(submitButton);
        form.appendChild(exitButton);
    
        // Ajout du formulaire à la page
        window.appendChild(form);
        section.appendChild(window);
    }
    
    // Fonction pour envoyer le formulaire à l'API
    function submitForm() {
        const form = document.getElementById('myForm');
    
        // Récupérer les données du formulaire
        const formData = new FormData(form);
    
        // objet JSON à partir des données du formulaire
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
    
        // Envoyer les données à l'API
        fetch('/equipe/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Réponse de l\'API :', data);
            // Réinitialiser le formulaire après l'envoi des données
            form.reset();
    
            fetchDataEquipe.then(data_equipe=> {
                Stock(data_equipe);
            }).catch(error => {
                console.error('Erreur lors de la récupération des données')
            });
        })
        .catch(error => console.error('Erreur lors de l\'envoi des données à l\'API :', error));
    }    

    


        exitButton.addEventListener('click', async function() {
            const data_equipe = await fetchDataEquipe();
            fetchDataEquipe().then(data_equipe => {
                Stock(data_equipe);
            }).catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
            });
        });

        // Ajout des boutons au formulaire
        form.appendChild(submitButton);
        form.appendChild(exitButton);

        // Ajout du formulaire à la page
        window.appendChild(form);
        section.appendChild(window);
    }


  

//AFFICHAGE PAGE ETAT DES LIEUX----------------------------------------------------
// Fonction pour afficher les données EDL
async function StockEDL() {
    const content = document.getElementById('content');

    // Mise à zéro du dashboard
    if (content.childElementCount > 0) {
        content.innerHTML = "";
    }

    try {
        // Récupérer les données EDL de l'API
        const data_edl = await fetchDataEDL();

        // Création des éléments
        const section = document.createElement('div');
        const title = document.createElement('h1');
        const table = document.createElement('table');
        const buttonModif = document.createElement("button");
        const buttonDelete = document.createElement("button");
        const buttonRAPPORT = document.createElement("button");
        const section_button = document.createElement('div');

        // Créer une ligne d'en-tête pour le tableau
        const headerRow = table.insertRow(0);
        const headerNames = ['ID', 'ID Equipe', 'Type', 'Unité Fut1', 'Unité Fut2', 'Unité Verre', 'Date', 'Heure']; // Remplacez ces noms par ceux que vous souhaitez

        headerNames.forEach(name => {
            const th = document.createElement('th');
            th.textContent = name;
            headerRow.appendChild(th);
        });

        // Modification des éléments
        title.textContent = "EDL";
        buttonModif.classList.add("button2");
        buttonDelete.classList.add('button2');
        buttonRAPPORT.classList.add('button2');
        buttonModif.id = 'modif';
        buttonModif.textContent = "Nouveau";
        buttonDelete.textContent = "Suppression";
        buttonRAPPORT.textContent = "Rapports";

        data_edl.forEach(async item => {
            const row = table.insertRow();

            // Récupérer le nom de l'équipe à partir de l'ID
            const equipeName = await getTeamNameById(item.equipe_id);

            // Ajouter les autres colonnes dans la ligne
            Object.values(item).forEach((value, index) => {
                const cell = row.insertCell();

                // Si c'est la colonne "equipe_id", utiliser le nom de l'équipe
                if (Object.keys(item)[index] === 'equipe_id') {
                    cell.textContent = equipeName;
                } else {
                    cell.textContent = value;
                }
            });
        });



        // Rajout des éléments
        section_button.appendChild(buttonModif);
        section_button.appendChild(buttonDelete);
        section_button.appendChild(buttonRAPPORT);

        section.appendChild(title);
        section.appendChild(section_button);
        section.appendChild(table);
        section.classList.add('EDL_CONTAINER');
        content.appendChild(section);

        // Bouton modification
        buttonModif.addEventListener('click', function () {

            sendDataToApi();
        });

        // Fonction pour soumettre le formulaire
        function sendDataToApi() {
            section.removeChild(table);
            section.removeChild(section_button);
            title.textContent = "Nouvelle Etat des lieux ";

            // Création du formulaire
            const form = document.createElement('form');
            const window = document.createElement('div');
            const popup = document.getElementById('popup');
            form.id = 'myForm';

            // Liste des champs du formulaire
            const fields = [
                { label: 'ID de L\'Equipe :', type: 'select', id: 'equipe_id', name: 'equipe_id', required: true },
                { label: 'Type :', type: 'text', id: 'type', name: 'prix', required: true },
                { label: 'Unité fut1 :', type: 'number', id: 'unite_fut1', name: 'prix_de_vente', required: true },
                { label: 'Unité fut2 :', type: 'number', id: 'unite_fut2', name: 'prix_de_vente', required: true },
                { label: 'Nombre de verre :', type: 'number', id: 'nombre_verre', name: 'prix_de_vente', required: true },
            ];

            // Pour le champ 'equipe_id', vous pouvez ajouter une fonction pour récupérer toutes les équipes depuis votre serveur
            async function fetchTeams() {
                try {
                    const response = await fetch('/equipe');
                    const data = await response.json();

                    if (response.ok) {
                        return data;
                    } else {
                        console.error(`Erreur : ${data.error}`);
                        throw new Error(`Erreur : ${data.error}`);
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des équipes :', error);
                    throw error;
                }
            }

            // Ajouter les champs au formulaire
            fields.forEach(field => {
                const label = document.createElement('label');
                label.textContent = field.label;

                const input = document.createElement(field.type === 'select' ? 'select' : 'input');
                input.id = field.id;
                input.name = field.name;
                if (field.required) {
                    input.required = true;
                }

                label.setAttribute('for', field.id);

                // Si c'est un champ de sélection, ajoutez les options
                if (field.type === 'select') {
                    const equipeSelect = input;

                    // Récupérez les équipes depuis le serveur et ajoutez-les comme options
                    fetchTeams().then(teams => {
                        teams.forEach(equipe => {
                            const option = document.createElement('option');
                            option.value = equipe.id; // Assurez-vous que 'id' correspond à l'ID de l'équipe dans votre base de données
                            option.textContent = equipe.name_equipe; // Assurez-vous que 'name_equipe' correspond au nom de l'équipe dans votre base de données
                            equipeSelect.appendChild(option);
                        });
                    }).catch(error => {
                        console.error('Erreur lors de la récupération des équipes :', error);
                    });
                }

                // Ajouter les éléments au formulaire
                form.appendChild(label);
                form.appendChild(input);
            });

            // Ajouter un bouton de soumission et de retour
            const submitButton = document.createElement('button');
            const exitButton = document.createElement('button');

            submitButton.type = 'button';
            submitButton.textContent = 'Envoyer';
            exitButton.textContent = "Annuler";
            submitButton.classList = 'button2';
            exitButton.classList = 'button2';

            submitButton.addEventListener('click', () => submitForm());

            exitButton.addEventListener('click', function () {
                // Supposons que fetchDataStock() soit une fonction qui récupère les données du stock
                fetchDataEDL().then(data_edl => {
                    Stock(data_edl);
                }).catch(error => {
                    console.error('Erreur lors de la récupération des données :', error);
                });
            });

            // Ajouter le bouton au formulaire
            form.appendChild(submitButton);
            form.appendChild(exitButton);

            // Ajouter le formulaire au document
            window.appendChild(form);
            section.appendChild(window);
        }

        // Fonction pour soumettre le formulaire
        function submitForm() {
            const form = document.getElementById('myForm');

            // Récupérer les données du formulaire
            const formData = new FormData(form);

            // Créer un objet JSON à partir des données du formulaire
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            // Envoyer les données à l'API
            fetch('/edl/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Réponse de l\'API :', data);
                // Réinitialiser le formulaire après l'envoi des données
                form.reset();

                fetchDataEDL().then(data_edl => {
                    StockEDL();
                }).catch(error => {
                    console.error('Erreur lors de la récupération des données');
                });
            })
            .catch(error => console.error('Erreur lors de l\'envoi des données à l\'API :', error));
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données EDL :', error);
    }
}

// LANCER LA PAGE EDL
document.addEventListener('DOMContentLoaded', function () {
    const edlButton = document.getElementById('edl-button');
    edlButton.addEventListener('click', function () {
        // Appel de la fonction pour afficher les données EDL
        StockEDL();
    });
});    
//AFFICHAGE PAGE ETAT DES LIEUX----------------------------------------------------
function Wait() {
    const content = document.getElementById('content')
    //Mise à zero du dashbord
    if (content.childElementCount > 0) {
        content.innerHTML =""   
    }

    const section = document.createElement('div')
    const title   = document.createElement('h1')
    const loaderDiv = document.createElement('div')
    const innerDiv =document.createElement('div')


    loaderDiv.className = "loader"
    innerDiv.className = "justify-content-center jimu-primary-loading"
    title.textContent = "En construction"

    loaderDiv.appendChild(innerDiv)
    section.appendChild(title)
    section.classList.add('STOCK_CONTAINER')
    section.appendChild(loaderDiv)
    content.appendChild(section)
}


//AFFICHAGE PAGE BAR----------------------------------------------------
function Bar() {
    const content = document.getElementById('content')
    //Mise à zero du dashbord
    if (content.childElementCount > 0) {
        content.innerHTML =""   
    }
    const section = document.createElement('div')
    const title   = document.createElement('BAR1 ')
    title.textContent = "Utilisateurs"

}

//Lancement de la page HOME
document.addEventListener('DOMContentLoaded', Home())