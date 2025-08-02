import type { Contract, MiscellaneousDocument } from './types';

export const contracts: Contract[] = [
  {
    id: 1,
    type: 'Εργολαβικό',
    number: '1234/2022',
    date: '15/01/2022',
    notary: 'Παπαδοπούλου Α.',
    path: 'C:/contracts/ergolaviko_1234.pdf',
    cert_no: '5678',
    transfer_date: '20/01/2022',
    registry: 'Υποθ. Θεσσαλονίκης',
    volume: '100',
    num: '10'
  },
  {
    id: 2,
    type: 'Προσύμφωνο',
    number: '5678/2022',
    date: '22/03/2022',
    notary: 'Ιωάννου Ι.',
    path: 'C:/contracts/prosymfono_5678.pdf',
    cert_no: '9101',
    transfer_date: '25/03/2022',
    registry: 'Υποθ. Θεσσαλονίκης',
    volume: '101',
    num: '15'
  },
   {
    id: 3,
    type: 'Διανομή',
    number: '9101/2023',
    date: '10/05/2023',
    notary: 'Γεωργίου Γ.',
    path: 'C:/contracts/dianomi_9101.pdf',
    cert_no: '1121',
    transfer_date: '12/05/2023',
    registry: 'Υποθ. Θεσσαλονίκης',
    volume: '102',
    num: '20'
  }
];


export const miscellaneousDocuments: MiscellaneousDocument[] = [
    {
        id: 1,
        description: "Άδεια Οικοδομής",
        doc_no: "A-123/2022",
        date: "10/01/2022",
        path: "C:/docs/adeia_oikodomis.pdf",
        by: "Γραμματεία"
    },
    {
        id: 2,
        description: "Τοπογραφικό Διάγραμμα",
        doc_no: "T-456",
        date: "05/12/2021",
        path: "C:/docs/topografiko.pdf",
        by: "Τοπογράφος"
    },
    {
        id: 3,
        description: "Στατική Μελέτη",
        doc_no: "S-789",
        date: "15/12/2021",
        path: "C:/docs/statiki_meleti.pdf",
        by: "Πολ. Μηχανικός"
    }
];