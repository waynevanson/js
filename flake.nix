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
        nativeBuildInputs = with pkgs; [
          direnv
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
