const fs = require('fs');
const path = require('path');

// Create sample CSV files for testing
const sampleCSV1 = `Signature,Block Time,Human Time,Action,From,To,Amount,Value,Decimals,Token Address,Multiplier
5ebSsJigph9JTWV7BaiHd2yzN9zmZBMETPcRyD48RoG6W5FiYLWH7Zq32rc3k6L6g9e2bq1hgr5v1nGqaFJe87hY,1757375827,2025-09-08T23:57:07.000Z,TRANSFER,ELqmSfVxTSkoGEdiH2TAbZUwMJYaxpdeJPaitFJqEyTA,5TRZYZXU8WnxG3R56Cz2j2DeE2CtWfzD2fYRvAUnSs8D,37915622276,0.2513,6,HLxdqSmiKamc4quBoMTxNVecTpJvzPRvrKg2HUJGEQcY,1.0
PLEKyjJCXW8BXJeqjB3bZ4xRQexJqbxv7BxNuVdz4v6Sqa72DXNqucxr1NTrZsRyRZzz6KHbo6ayD5pcNKP3d6i,1757375817,2025-09-08T23:56:57.000Z,TRANSFER,5TRZYZXU8WnxG3R56Cz2j2DeE2CtWfzD2fYRvAUnSs8D,ELqmSfVxTSkoGEdiH2TAbZUwMJYaxpdeJPaitFJqEyTA,22938580737,0.152,6,HLxdqSmiKamc4quBoMTxNVecTpJvzPRvrKg2HUJGEQcY,1.0
A1BzVjtt1aWwTgyvpeHmt5pM2L3aSht9WdK1UsFTGViHmZsQi8PFgubGmqdx1rWG2j1xdT4Mu8bR9zNjWoca7pj,1757375809,2025-09-08T23:56:49.000Z,TRANSFER,5TRZYZXU8WnxG3R56Cz2j2DeE2CtWfzD2fYRvAUnSs8D,ELqmSfVxTSkoGEdiH2TAbZUwMJYaxpdeJPaitFJqEyTA,14977041539,0.09925,6,HLxdqSmiKamc4quBoMTxNVecTpJvzPRvrKg2HUJGEQcY,1.0`;

const sampleCSV2 = `Signature,Block Time,Human Time,Action,From,To,Amount,Value,Decimals,Token Address,Multiplier
4cn7YdKzyYMu1m9MKVRfQb9sqpdkEs8LfA4CyfewcYGyRLiXuWzVbcP6CqDezD3V9fdcPo12VwPxgUdSZYy1RRU9,1757355740,2025-09-08T18:22:20.000Z,TRANSFER,35dszeQQQzkMvjcmyrPWPnN5ZyK9ZjYkNp9kKXZWMvji,5TRZYZXU8WnxG3R56Cz2j2DeE2CtWfzD2fYRvAUnSs8D,43736410499,0.2893,6,HLxdqSmiKamc4quBoMTxNVecTpJvzPRvrKg2HUJGEQcY,1.0
38yAtZZQk1ZygCiyfeg5vBn6cfagS3AnQNyQTxTcAw4QpC5MgTMFUYwmFiqr3tT61NfDjCKzv77nqvqwUafh9Wtf,1757355023,2025-09-08T18:10:23.000Z,TRANSFER,68S7QYpDewENLZ38m9Nu1QMGQtbt55eTfCtKncCrQUS5,5TRZYZXU8WnxG3R56Cz2j2DeE2CtWfzD2fYRvAUnSs8D,88736660923,0.5848,6,HLxdqSmiKamc4quBoMTxNVecTpJvzPRvrKg2HUJGEQcY,1.0
2DfmpLErgt4YjpL3VJhqgLGfAmFUwsvLG2buu7jQwNvGoX5b1y2cwwuib5cMEwa8tMerDWx3owrhoxcouugyUB7j,1757347506,2025-09-08T16:05:06.000Z,TRANSFER,HV1KXxWFaSeriyFvXyx48FqG9BoFbfinB8njCJonqP7K,5TRZYZXU8WnxG3R56Cz2j2DeE2CtWfzD2fYRvAUnSs8D,98564266350,0.6506,6,HLxdqSmiKamc4quBoMTxNVecTpJvzPRvrKg2HUJGEQcY,1.0`;

// Create demo directory
const demoDir = path.join(__dirname, 'demo-files');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir);
}

// Write sample files
fs.writeFileSync(path.join(demoDir, 'sample1.csv'), sampleCSV1);
fs.writeFileSync(path.join(demoDir, 'sample2.csv'), sampleCSV2);

console.log('✅ Demo files created in demo-files/ directory');
console.log('📁 You can use these files to test the application:');
console.log('   - demo-files/sample1.csv');
console.log('   - demo-files/sample2.csv');
console.log('');
console.log('🚀 To start the application:');
console.log('   1. Run: npm run dev');
console.log('   2. Or double-click: start.bat');
console.log('');
console.log('📦 To build executable:');
console.log('   1. Run: npm run build-exe');
console.log('   2. Or run: node build.js');
