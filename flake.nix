{
  description = "";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [
          (self: super: rec {
            nodejs = super.nodejs-18_x;
            pnpm = super.nodePackages.pnpm;
          })
        ];
        pkgs = import nixpkgs { inherit overlays system; };
        lib = nixpkgs.lib;
        packages = with pkgs; [
          #
          ii
          nodejs
          pnpm
        ];
      in {
        devShells.default = pkgs.mkShell {
          packages = packages;
          shellHook = "echo 'entering dev shell'";
        };
      });
}
