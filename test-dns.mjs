// test-dns.mjs
import dns from 'node:dns/promises';

const host = 'myapp-database.cnqaak2s2fdr.eu-north-1.rds.amazonaws.com';

dns.lookup(host).then(console.log).catch(console.error);
