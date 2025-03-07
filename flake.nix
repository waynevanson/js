{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
        pnpm = pkgs.pnpm.override {
          version = "10.6.0";
          hash = "sha256-ceojXmEeLI5gQ//KHCePggifcd/sTR6dAbR4JeXpL4k=";
        };
        lerna = pkgs.writeShellScriptBin "lerna" "pnpm exec lerna $@";
        nativeBuildInputs = with pkgs; [
          direnv
          lerna
          nodejs
          pnpm
        ];
      in {
        devShells.default =
          pkgs.mkShell {
            inherit system nativeBuildInputs;
          };
      }
    );
}
