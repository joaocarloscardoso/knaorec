module.exports = {
    Recommendation: {
        Priority: 'Urgent|Regular',
        RiskCharacterization: 'Governance|Operational|Reputational|Financial|Compliance|Misappropriation of assets',
        RiskEvaluation: 'State|Region|Municipality|Activity Area|Entity',
        Importance: 'Strategic|Important, but not essential',
        ImplementationStatus: 'Implemented|Started Implementation|Partially implemented|Final Stage Implementation|Not started Implementation|Not addressed|No longer applicable',
        Repeated: 'New|Repeated|Partially Rep.'
    },
    NodeAttributes:{
        Priority: 'priority',
        RiskCharacterization: 'risk',
        RiskEvaluation: 'riskevaluation',
        Importance: 'importance',
        ImplementationStatus: 'status',
        Repeated: 'repeated'
    },
    weblang: {
        en:{
            main:{
                country:'REPUBLIC OF KOSOVO',
                sai:'NATIONAL AUDIT OFFICE',
                module:'Recommendations tracking system',
                update:'Last update',
                introduction:'The audits are presented as "collections", aggregated by type, subject, chronological milestones and their recommendations, along with related findings can be tracked and monitored here.',
                note1: 'Note',
                note2:'Only the audits published and authorized by the KNAO are available in the web version.',
                portfolio_subject:'Covers',
                portfolio_sai:'SAI',
                externallinks:'External Related Links',
                noaudits:'No audits available!',
                number: 'Number',
                search: 'Search',
                searchresults: 'Search results',
                numberresults:'$$$ Recommendation(s) were found. The results are ordered by relevance.',
                noteresults: 'In order to avoid excessive consumption of system resources only the first 100 results were retrieved. Try to be more specific in the search criteria!',
                presentin:'Present in: ',
                noresults: 'The search did not return recommendations!'
            },
            search: {
                introduction: 'Search tool on audit recommendations',
                note1: 'Note',
                note2: 'Type the search terms in the text box or combine them with the advanced options and press the search button',
                button: 'Search',
                option1: 'Any word',
                option2: 'Exact match',
                priority: 'By priority',
                riskareas: 'By risk area',
                rectype: 'By level',
                recimportance: 'By importance',
                status: 'By implementation status',
                repeated: 'Repeated?',
                advanced: 'Advanced options',
                ShowRec:'More information...',
                HideRec:'Less information'
            },
            portfolio:{
                rectstatus:'Global Recommendations Status',
                newissues: 'New Issues',
                riskareas: 'Risk areas identified'
            },
            audit:{
                recprogress: 'Progress of recommendations',
                priority: 'Priority',
                riskareas: 'Risk areas identified',
                rectype: 'Recommendations by type',
                recimportance: 'Importance of recommendations',
                status: 'Status (overall)',
                repeated: 'Repeated?',
                tabreccol1: 'Recommendation',
                tabreccol2: 'Priority',
                tabreccol3: 'Area',
                tabreccol4: 'Level',
                tabreccol5: 'Timeline',
                tabreccol6: 'Status',
                audit: 'Audit',
                year: 'year',
                background: 'Audit background',
                scope: 'Audit scope'
            },
            Recommendation: {
                Priority: 'Urgent|Regular',
                RiskCharacterization: 'Governance|Operational|Reputational|Financial|Compliance|Misappropriation of assets',
                RiskEvaluation: 'State|Region|Municipality|Activity Area|Entity',
                Importance: 'Strategic|Important, but not essential',
                ImplementationStatus: 'Implemented|Started Implementation|Partially implemented|Final Stage Implementation|Not started Implementation|Not addressed|No longer applicable',
                Repeated: 'New|Repeated|Partially Rep.'
            }

        },
        sq:{
            main:{
                country:'REPUBLIKA E KOSOVËS',
                sai:'ZYRA KOMBËTARE E AUDITIMIT',
                module:'Sistemi i ndjekjes së rekomandimeve',
                update:'Përditësimi i fundit',
                introduction:'Auditimet paraqiten si "koleksione", të grumbulluara sipas llojit, lëndës, pikave kronologjike dhe rekomandimet e tyre, së bashku me gjetjet përkatëse mund të gjurmohen dhe monitorohen këtu.',
                note1: 'Shënim',
                note2:'Vetëm auditimet e publikuara dhe të autorizuara nga KNAO janë në dispozicion në versionin në internet.',
                portfolio_subject:'Për të përfshirë',
                portfolio_sai:'ISA',
                externallinks:'Lidhje të Jashtme të Lidhura',
                noaudits:'Nuk ka auditime të disponueshme!',
                number: 'Numrin',
                search: 'Kërko',
                searchresults: 'Rezultatet e kërkimit',
                numberresults:'U gjetën $$$ rekomandimet. Rezultatet renditen sipas rëndësisë.',
                noteresults: 'Në mënyrë që të shmanget konsumi i tepërt i burimeve të sistemit u morën vetëm 100 rezultatet e para. Mundohuni të jeni më specifik në kriteret e kërkimit!',
                presentin:'Të pranishëm në: ',
                noresults: 'Kërkimi nuk i ktheu rekomandimet!'
            },
            search: {
                introduction: 'Mjet kërkimi për rekomandimet e auditimit',
                note1: 'Shënim',
                note2: 'Shtypni termat e kërkimit në kutinë e tekstit ose kombinojini ato me opsionet e përparuara dhe shtypni butonin e kërkimit',
                button: 'Kërko',
                option1: 'Çdo fjalë',
                option2: 'Përputhja e saktë',
                priority: 'Sipas përparësisë',
                riskareas: 'Sipas zonës së rrezikut',
                rectype: 'Sipas nivelit',
                recimportance: 'Nga rëndësia',
                status: 'Sipas statusit të zbatimit',
                repeated: 'Përsëritet?',
                advanced: 'Opsione te avancuara',
                ShowRec:'Më shumë informacion ...',
                HideRec:'Më pak informacion'
            },
            portfolio:{
                rectstatus:'Statusi i Rekomandimeve Globale',
                newissues: 'Çështje të reja',
                riskareas: 'Zonat e rrezikut të identifikuara'
            },
            audit:{
                recprogress: 'Progresi i rekomandimeve',
                priority: 'Përparësi',
                riskareas: 'Zonat e rrezikut të identifikuara',
                rectype: 'Rekomandimet sipas llojit',
                recimportance: 'Rëndësia e rekomandimeve',
                status: 'Statusi (i përgjithshëm)',
                repeated: 'Përsëritet?',
                tabreccol1: 'Rekomandimi',
                tabreccol2: 'Përparësi',
                tabreccol3: 'Zona',
                tabreccol4: 'Niveli',
                tabreccol5: 'Afati kohor',
                tabreccol6: 'Statusi',
                audit: 'Kontrolli',
                year: 'viti',
                background: 'Sfondi i auditimit',
                scope: 'Fusha e auditimit'
            },
            Recommendation: {
                Priority: 'Urgjente|E rregullt',
                RiskCharacterization: 'Qeverisja|Operative|Reputacion|Financiar|Pajtueshmëria|Shpërdorimi i pasurive',
                RiskEvaluation: 'Shteti|rajoni|komuna|zona e veprimtarisë|njësia ekonomike',
                Importance: 'Strategjik|E rëndësishme, por jo thelbësore',
                ImplementationStatus: 'Zbatuar|Zbatimi i filluar|Zbatuar pjesërisht|Zbatimi i fazës finale|Zbatimi nuk ka filluar|Nuk adresohet|Nuk zbatohet më',
                Repeated: 'Gjithsej|E Re|Përsëritur|Pjesërisht e Për.'
            }
        },
        sr:{
            main:{
                country:'REPUBLIKA KOSOVA',
                sai:'NATIONALNA KANCELARIJA REVIZIJE',
                module:'Sistem praćenja preporuka',
                update:'Poslednje ažuriranje',
                introduction:'Revizije su predstavljene kao „zbirke“, objedinjene po tipu, predmetu, hronološkim prekretnicama i njihove preporuke, zajedno sa srodnim nalazima mogu se ovde pratiti i nadgledati.',
                note1: 'Beleška',
                note2:'Samo revizije objavljene i odobrene od strane KNAO su dostupne u veb verziji.',
                portfolio_subject:'Obuhvatiti',
                portfolio_sai:'VRI',
                externallinks:'Spoljne povezane veze',
                noaudits:'Nije dostupna revizija!',
                number: 'Broj',
                search: 'Pretraga',
                searchresults: 'Rezultati pretrage',
                numberresults:'Pronađene su $$$ preporuke. Rezultati su poredani po važnosti.',
                noteresults: 'Da bi se izbegla prekomerna potrošnja sistemskih resursa, pronađeno je samo prvih 100 rezultata. Pokušajte da budete precizniji u kriterijumima pretrage!',
                presentin:'Prisutan na: ',
                noresults: 'Pretraga nije vratila preporuke!'
            },
            search: {
                introduction: 'Alat za pretragu po preporukama revizije',
                note1: 'Beleška',
                note2: 'Unesite pojmove za pretragu u okvir za tekst ili ih kombinirajte sa naprednim opcijama i pritisnite dugme za pretragu',
                button: 'Pretraga',
                option1: 'Bilo koja reč',
                option2: 'Tačan meč',
                priority: 'Prioritetno',
                riskareas: 'Prema rizičnom području',
                rectype: 'Po nivou',
                recimportance: 'Po važnosti',
                status: 'Po statusu primene',
                repeated: 'Ponovljeno?',
                advanced: 'Napredne opcije',
                ShowRec:'Više informacija ...',
                HideRec:'Manje informacija'
            },
            portfolio:{
                rectstatus:'Status globalnih preporuka',
                newissues: 'Nova izdanja',
                riskareas: 'Identifikovana područja rizika'
            },
            audit:{
                recprogress: 'Napredak preporuka',
                priority: 'Prioritet',
                riskareas: 'Identifikovana područja rizika',
                rectype: 'Preporuke prema tipu',
                recimportance: 'Značaj preporuka',
                status: 'Status (sveukupno)',
                repeated: 'Ponovljeno?',
                tabreccol1: 'Preporuka',
                tabreccol2: 'Prioritet',
                tabreccol3: 'Površina',
                tabreccol4: 'Nivo',
                tabreccol5: 'Vremenska linija',
                tabreccol6: 'Status',
                audit: 'Revizija',
                year: 'godina',
                background: 'Pozadina revizije',
                scope: 'Obim revizije'
            },
            Recommendation: {
                Priority: 'Hitno|Redovno',
                RiskCharacterization: 'Upravljanje|Operativno|Reputaciono|Finansijsko|Usklađenost|Neprilagodba imovine',
                RiskEvaluation: 'Država|Regija|Opština|Oblast delatnosti|Entitet',
                Importance: 'Strateški|Važno, ali ne i bitno',
                ImplementationStatus: 'Implementirano|Započeta implementacija|Delimično primenjena|Implementacija završne faze|Nije započeta implementacija|Nije adresirano|Više nije primenljivo',
                Repeated: 'Ukupno|Novo|Ponovljeno|Delimično pon.'
            }
        }
    }
};