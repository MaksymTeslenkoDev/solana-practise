module.exports =
  ({ scripts }) =>
  async () => {
    const {mint, mintAuthority} = await scripts.createSingleMintToken();
    
  };
