import bcrypt from 'bcrypt';

const run = async () => {
  const hash = await bcrypt.hash('admin', 10);
  console.log(hash);
};

run();

// $2b$10$DFdNFmz5iM9QJJtk/vaQeuFvBzdr/MfBmQdPszdCGatiiM.6QEGJG
