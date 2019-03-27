module.exports = {
    apps: [
      {
          script: "ts-node",
          args: "-r tsconfig-paths/register ./src/index.ts",
          watch: true,
          name: "Ookami"
      }
    ]
};
