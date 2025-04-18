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
        nativeBuildInputs = with pkgs; [
          corepack
          direnv
          nodejs
        ];
      in {
        devShells.default =
          pkgs.mkShell {
            inherit system nativeBuildInputs;
            NODE_AUTH_TOKEN = "required-otherwise-lint-staged-hooks-fail";
          };
      }
    );
}
