 2026-01-26T21:33:19.050527986Z [inf]  
2026-01-26T21:33:20.392777550Z [inf]  [35m[Region: us-east4][0m
2026-01-26T21:33:20.407222674Z [inf]  [35m==============
2026-01-26T21:33:20.407270452Z [inf]  Using Nixpacks
2026-01-26T21:33:20.407279829Z [inf]  ==============
2026-01-26T21:33:20.407286733Z [inf]  [0m
2026-01-26T21:33:20.407452063Z [inf]  context: jqg2-K7u1
2026-01-26T21:33:20.556459654Z [inf]  ╔════════ Nixpacks v1.38.0 ═══════╗
2026-01-26T21:33:20.556499654Z [inf]  ║ setup      │ nodejs_20, npm-9_x ║
2026-01-26T21:33:20.556507486Z [inf]  ║─────────────────────────────────║
2026-01-26T21:33:20.556512389Z [inf]  ║ install    │ npm ci             ║
2026-01-26T21:33:20.556519704Z [inf]  ║─────────────────────────────────║
2026-01-26T21:33:20.556524784Z [inf]  ║ build      │ npm run build      ║
2026-01-26T21:33:20.556529609Z [inf]  ║─────────────────────────────────║
2026-01-26T21:33:20.556534559Z [inf]  ║ start      │ npm run start:auto ║
2026-01-26T21:33:20.556539364Z [inf]  ╚═════════════════════════════════╝
2026-01-26T21:33:20.921277420Z [inf]  [internal] load build definition from Dockerfile
2026-01-26T21:33:20.921399065Z [inf]  [internal] load build definition from Dockerfile
2026-01-26T21:33:20.921431900Z [inf]  [internal] load build definition from Dockerfile
2026-01-26T21:33:20.941974696Z [inf]  [internal] load build definition from Dockerfile
2026-01-26T21:33:20.946891978Z [inf]  [internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1745885067
2026-01-26T21:33:21.037681692Z [inf]  [internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1745885067
2026-01-26T21:33:21.038007034Z [inf]  [internal] load .dockerignore
2026-01-26T21:33:21.038040145Z [inf]  [internal] load .dockerignore
2026-01-26T21:33:21.038416648Z [inf]  [internal] load .dockerignore
2026-01-26T21:33:21.053858246Z [inf]  [internal] load .dockerignore
2026-01-26T21:33:21.065856311Z [inf]  [internal] load build context
2026-01-26T21:33:21.066731629Z [inf]  [internal] load build context
2026-01-26T21:33:21.189284727Z [inf]  [internal] load build context
2026-01-26T21:33:21.194028673Z [inf]  [stage-0  2/15] WORKDIR /app/
2026-01-26T21:33:21.194094266Z [inf]  [stage-0  3/10] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
2026-01-26T21:33:21.400873490Z [inf]  [stage-0  3/10] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
2026-01-26T21:33:21.405604347Z [inf]  [stage-0  4/10] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
2026-01-26T21:33:21.632986549Z [inf]  unpacking 'https://github.com/NixOS/nixpkgs/archive/ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.tar.gz' into the Git cache...

2026-01-26T21:34:03.534929152Z [inf]  unpacking 'https://github.com/railwayapp/nix-npm-overlay/archive/main.tar.gz' into the Git cache...

2026-01-26T21:34:04.074476324Z [inf]  installing 'ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env'

2026-01-26T21:34:04.764917896Z [inf]  these 5 derivations will be built:

2026-01-26T21:34:04.764940311Z [inf]    /nix/store/1f4a312hz9m6y1ssip52drgkim8az4d6-libraries.drv
  /nix/store/6vy68gykpxfphbmmyd59ya88xvrwvvaa-npm-9.9.4.tgz.drv
  /nix/store/79g4v87v1cgrx5vlwzcagcs6v8ps8fk2-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env.drv
  /nix/store/w9h0z1lhfwxc0m38f3w5brfdqrzm4wyj-npm.drv

2026-01-26T21:34:04.76494476Z [inf]    /nix/store/j35hwrlsfar9sl236alrb60mcvhxqyp7-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env.drv

2026-01-26T21:34:04.765002972Z [inf]  these 75 paths will be fetched (117.76 MiB download, 559.92 MiB unpacked):

2026-01-26T21:34:04.765020824Z [inf]    /nix/store/cf7gkacyxmm66lwl5nj6j6yykbrg4q5c-acl-2.3.2
  /nix/store/a9jgnlhkjkxav6qrc3rzg2q84pkl2wvr-attr-2.5.2
  /nix/store/5mh7kaj2fyv8mk4sfq1brwxgc02884wi-bash-5.2p37
  /nix/store/j7p46r8v9gcpbxx89pbqlh61zhd33gzv-binutils-2.43.1
  /nix/store/df2a8k58k00f2dh2x930dg6xs6g6mliv-binutils-2.43.1-lib

2026-01-26T21:34:04.765068099Z [inf]    /nix/store/srcmmqi8kxjfygd0hyy42c8hv6cws83b-binutils-wrapper-2.43.1
  /nix/store/wf5zj2gbib3gjqllkabxaw4dh0gzcla3-builder.pl
  /nix/store/ivl2v8rgg7qh1jkj5pwpqycax3rc2hnl-bzip2-1.0.8
  /nix/store/mglixp03lsp0w986svwdvm7vcy17rdax-bzip2-1.0.8-bin
  /nix/store/4s9rah4cwaxflicsk5cndnknqlk9n4p3-coreutils-9.5

2026-01-26T21:34:04.765083104Z [inf]    /nix/store/pkc7mb4a4qvyz73srkqh4mwl70w98dsv-curl-8.11.0
  /nix/store/p123cq20klajcl9hj8jnkjip5nw6awhz-curl-8.11.0-bin

2026-01-26T21:34:04.765086448Z [inf]    /nix/store/5f5linrxzhhb3mrclkwdpm9bd8ygldna-curl-8.11.0-dev

2026-01-26T21:34:04.765089441Z [inf]    /nix/store/agvks3qmzja0yj54szi3vja6vx3cwkkw-curl-8.11.0-man

2026-01-26T21:34:04.765103403Z [inf]    /nix/store/00g69vw7c9lycy63h45ximy0wmzqx5y6-diffutils-3.10
  /nix/store/74h4z8k82pmp24xryflv4lxkz8jlpqqd-ed-1.20.2

2026-01-26T21:34:04.765120472Z [inf]    /nix/store/qbry6090vlr9ar33kdmmbq2p5apzbga8-expand-response-params
  /nix/store/c4rj90r2m89rxs64hmm857mipwjhig5d-file-5.46

2026-01-26T21:34:04.765132401Z [inf]    /nix/store/jqrz1vq5nz4lnv9pqzydj0ir58wbjfy1-findutils-4.10.0
  /nix/store/a3c47r5z1q2c4rz0kvq8hlilkhx2s718-gawk-5.3.1

2026-01-26T21:34:04.765149536Z [inf]    /nix/store/l89iqc7am6i60y8vk507zwrzxf0wcd3v-gcc-14-20241116
  /nix/store/bpq1s72cw9qb2fs8mnmlw6hn2c7iy0ss-gcc-14-20241116-lib

2026-01-26T21:34:04.765162464Z [inf]    /nix/store/17v0ywnr3akp85pvdi56gwl99ljv95kx-gcc-14-20241116-libgcc
  /nix/store/xcn9p4xxfbvlkpah7pwchpav4ab9d135-gcc-wrapper-14-20241116

2026-01-26T21:34:04.765165629Z [inf]    /nix/store/65h17wjrrlsj2rj540igylrx7fqcd6vq-glibc-2.40-36

2026-01-26T21:34:04.765203558Z [inf]    /nix/store/1c6bmxrrhm8bd26ai2rjqld2yyjrxhds-glibc-2.40-36-bin
  /nix/store/kj8hbqx4ds9qm9mq7hyikxyfwwg13kzj-glibc-2.40-36-dev
  /nix/store/kryrg7ds05iwcmy81amavk8w13y4lxbs-gmp-6.3.0

2026-01-26T21:34:04.765210044Z [inf]    /nix/store/a2byxfv4lc8f2g5xfzw8cz5q8k05wi29-gmp-with-cxx-6.3.0

2026-01-26T21:34:04.765214474Z [inf]    /nix/store/1m67ipsk39xvhyqrxnzv2m2p48pil8kl-gnu-config-2024-01-01
  /nix/store/aap6cq56amx4mzbyxp2wpgsf1kqjcr1f-gnugrep-3.11

2026-01-26T21:34:04.765218519Z [inf]    /nix/store/fp6cjl1zcmm6mawsnrb5yak1wkz2ma8l-gnumake-4.4.1

2026-01-26T21:34:04.765223043Z [inf]    /nix/store/abm77lnrkrkb58z6xp1qwjcr1xgkcfwm-gnused-4.9

2026-01-26T21:34:04.765278922Z [inf]    /nix/store/9cwwj1c9csmc85l2cqzs3h9hbf1vwl6c-gnutar-1.35
  /nix/store/nvvj6sk0k6px48436drlblf4gafgbvzr-gzip-1.13
  /nix/store/wwipgdqb4p2fr46kmw9c5wlk799kbl68-icu4c-74.2
  /nix/store/m8w3mf0i4862q22bxad0wspkgdy4jnkk-icu4c-74.2-dev
  /nix/store/xmbv8s4p4i4dbxgkgdrdfb0ym25wh6gk-isl-0.20

2026-01-26T21:34:04.7652981Z [inf]    /nix/store/2wh1gqyzf5xsvxpdz2k0bxiz583wwq29-keyutils-1.6.3-lib
  /nix/store/milph81dilrh96isyivh5n50agpx39k2-krb5-1.21.3
  /nix/store/b56mswksrql15knpb1bnhv3ysif340kd-krb5-1.21.3-dev
  /nix/store/v9c1s50x7magpiqgycxxkn36avzbcg0g-krb5-1.21.3-lib
  /nix/store/34z2792zyd4ayl5186vx0s98ckdaccz9-libidn2-2.3.7
  /nix/store/2a3anh8vl3fcgk0fvaravlimrqawawza-libmpc-1.3.1
  /nix/store/8675pnfr4fqnwv4pzjl67hdwls4q13aa-libssh2-1.11.1
  /nix/store/d7zhcrcc7q3yfbm3qkqpgc3daq82spwi-libssh2-1.11.1-dev

2026-01-26T21:34:04.765331542Z [inf]    /nix/store/xcqcgqazykf6s7fsn08k0blnh0wisdcl-libunistring-1.3
  /nix/store/r9ac2hwnmb0nxwsrvr6gi9wsqf2whfqj-libuv-1.49.2
  /nix/store/ll14czvpxglf6nnwmmrmygplm830fvlv-libuv-1.49.2-dev

2026-01-26T21:34:04.76534079Z [inf]    /nix/store/6cr0spsvymmrp1hj5n0kbaxw55w1lqyp-libxcrypt-4.4.36
  /nix/store/pc74azbkr19rkd5bjalq2xwx86cj3cga-linux-headers-6.12

2026-01-26T21:34:04.765345591Z [inf]    /nix/store/fv7gpnvg922frkh81w5hkdhpz0nw3iiz-mirrors-list

2026-01-26T21:34:04.765350485Z [inf]    /nix/store/qs22aazzrdd4dnjf9vffl0n31hvls43h-mpfr-4.2.1

2026-01-26T21:34:04.765381102Z [inf]    /nix/store/grixvx878884hy8x3xs0c0s1i00j632k-nghttp2-1.64.0
  /nix/store/dz97fw51rm5bl9kz1vg0haj1j1a7r1mr-nghttp2-1.64.0-dev
  /nix/store/qcghigzrz56vczwlzg9c02vbs6zr9jkz-nghttp2-1.64.0-lib
  /nix/store/j7dx1n6m5axf9r2bvly580x2ixx546wq-nodejs-20.18.1

2026-01-26T21:34:04.765407685Z [inf]    /nix/store/9l9n7a0v4aibcz0sgd0crs209an9p7dz-openssl-3.3.2
  /nix/store/h1ydpxkw9qhjdxjpic1pdc2nirggyy6f-openssl-3.3.2

2026-01-26T21:34:04.765418252Z [inf]    /nix/store/lygl27c44xv73kx1spskcgvzwq7z337c-openssl-3.3.2-bin
  /nix/store/qq5q0alyzywdazhmybi7m69akz0ppk05-openssl-3.3.2-bin

2026-01-26T21:34:04.765426535Z [inf]    /nix/store/kqm7wpqkzc4bwjlzqizcbz0mgkj06a9x-openssl-3.3.2-dev

2026-01-26T21:34:04.765435034Z [inf]    /nix/store/pp2zf8bdgyz60ds8vcshk2603gcjgp72-openssl-3.3.2-dev
  /nix/store/5yja5dpk2qw1v5mbfbl2d7klcdfrh90w-patch-2.7.6

2026-01-26T21:34:04.765459256Z [inf]    /nix/store/srfxqk119fijwnprgsqvn68ys9kiw0bn-patchelf-0.15.0
  /nix/store/3j1p598fivxs69wx3a657ysv3rw8k06l-pcre2-10.44

2026-01-26T21:34:04.765467406Z [inf]    /nix/store/1i003ijlh9i0mzp6alqby5hg3090pjdx-perl-5.40.0
  /nix/store/4ig84cyqi6qy4n0sanrbzsw1ixa497jx-stdenv-linux

2026-01-26T21:34:04.765474007Z [inf]    /nix/store/d0gfdcag8bxzvg7ww4s7px4lf8sxisyx-stdenv-linux

2026-01-26T21:34:04.765482425Z [inf]    /nix/store/d29r1bdmlvwmj52apgcdxfl1mm9c5782-update-autotools-gnu-config-scripts-hook

2026-01-26T21:34:04.765488974Z [inf]    /nix/store/acfkqzj5qrqs88a4a6ixnybbjxja663d-xgcc-14-20241116-libgcc

2026-01-26T21:34:04.765493505Z [inf]    /nix/store/c2njy6bv84kw1i4bjf5k5gn7gz8hn57n-xz-5.6.3

2026-01-26T21:34:04.765548715Z [inf]    /nix/store/h18s640fnhhj2qdh5vivcfbxvz377srg-xz-5.6.3-bin
  /nix/store/cqlaa2xf6lslnizyj9xqa8j0ii1yqw0x-zlib-1.3.1

2026-01-26T21:34:04.765578559Z [inf]    /nix/store/1lggwqzapn5mn49l9zy4h566ysv9kzdb-zlib-1.3.1-dev

2026-01-26T21:34:04.775964811Z [inf]  copying path '/nix/store/wf5zj2gbib3gjqllkabxaw4dh0gzcla3-builder.pl' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.782251459Z [inf]  copying path '/nix/store/17v0ywnr3akp85pvdi56gwl99ljv95kx-gcc-14-20241116-libgcc' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.782273641Z [inf]  copying path '/nix/store/1m67ipsk39xvhyqrxnzv2m2p48pil8kl-gnu-config-2024-01-01' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.783014614Z [inf]  copying path '/nix/store/acfkqzj5qrqs88a4a6ixnybbjxja663d-xgcc-14-20241116-libgcc' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.783345231Z [inf]  copying path '/nix/store/xcqcgqazykf6s7fsn08k0blnh0wisdcl-libunistring-1.3' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.787447252Z [inf]  copying path '/nix/store/pc74azbkr19rkd5bjalq2xwx86cj3cga-linux-headers-6.12' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.787526833Z [inf]  copying path '/nix/store/fv7gpnvg922frkh81w5hkdhpz0nw3iiz-mirrors-list' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.788278129Z [inf]  copying path '/nix/store/agvks3qmzja0yj54szi3vja6vx3cwkkw-curl-8.11.0-man' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.78912643Z [inf]  copying path '/nix/store/grixvx878884hy8x3xs0c0s1i00j632k-nghttp2-1.64.0' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.792907135Z [inf]  copying path '/nix/store/d29r1bdmlvwmj52apgcdxfl1mm9c5782-update-autotools-gnu-config-scripts-hook' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.841769442Z [inf]  copying path '/nix/store/34z2792zyd4ayl5186vx0s98ckdaccz9-libidn2-2.3.7' from 'https://cache.nixos.org'...

2026-01-26T21:34:04.869235603Z [inf]  copying path '/nix/store/65h17wjrrlsj2rj540igylrx7fqcd6vq-glibc-2.40-36' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.478500522Z [inf]  copying path '/nix/store/a9jgnlhkjkxav6qrc3rzg2q84pkl2wvr-attr-2.5.2' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.47852237Z [inf]  copying path '/nix/store/5mh7kaj2fyv8mk4sfq1brwxgc02884wi-bash-5.2p37' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.4785259Z [inf]  copying path '/nix/store/ivl2v8rgg7qh1jkj5pwpqycax3rc2hnl-bzip2-1.0.8' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.478632373Z [inf]  copying path '/nix/store/74h4z8k82pmp24xryflv4lxkz8jlpqqd-ed-1.20.2' from 'https://cache.nixos.org'...
copying path '/nix/store/qbry6090vlr9ar33kdmmbq2p5apzbga8-expand-response-params' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.478701723Z [inf]  copying path '/nix/store/a3c47r5z1q2c4rz0kvq8hlilkhx2s718-gawk-5.3.1' from 'https://cache.nixos.org'...
copying path '/nix/store/bpq1s72cw9qb2fs8mnmlw6hn2c7iy0ss-gcc-14-20241116-lib' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.478828988Z [inf]  copying path '/nix/store/1c6bmxrrhm8bd26ai2rjqld2yyjrxhds-glibc-2.40-36-bin' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.478853727Z [inf]  copying path '/nix/store/kryrg7ds05iwcmy81amavk8w13y4lxbs-gmp-6.3.0' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.478997833Z [inf]  copying path '/nix/store/abm77lnrkrkb58z6xp1qwjcr1xgkcfwm-gnused-4.9' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.479019816Z [inf]  copying path '/nix/store/fp6cjl1zcmm6mawsnrb5yak1wkz2ma8l-gnumake-4.4.1' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.479145594Z [inf]  copying path '/nix/store/r9ac2hwnmb0nxwsrvr6gi9wsqf2whfqj-libuv-1.49.2' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.479171791Z [inf]  copying path '/nix/store/6cr0spsvymmrp1hj5n0kbaxw55w1lqyp-libxcrypt-4.4.36' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.479218379Z [inf]  copying path '/nix/store/qcghigzrz56vczwlzg9c02vbs6zr9jkz-nghttp2-1.64.0-lib' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.479374182Z [inf]  copying path '/nix/store/2wh1gqyzf5xsvxpdz2k0bxiz583wwq29-keyutils-1.6.3-lib' from 'https://cache.nixos.org'...
copying path '/nix/store/9l9n7a0v4aibcz0sgd0crs209an9p7dz-openssl-3.3.2' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.516574209Z [inf]  copying path '/nix/store/h1ydpxkw9qhjdxjpic1pdc2nirggyy6f-openssl-3.3.2' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.516881811Z [inf]  copying path '/nix/store/5yja5dpk2qw1v5mbfbl2d7klcdfrh90w-patch-2.7.6' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.517589996Z [inf]  copying path '/nix/store/mglixp03lsp0w986svwdvm7vcy17rdax-bzip2-1.0.8-bin' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.520852304Z [inf]  copying path '/nix/store/cf7gkacyxmm66lwl5nj6j6yykbrg4q5c-acl-2.3.2' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.524049795Z [inf]  copying path '/nix/store/3j1p598fivxs69wx3a657ysv3rw8k06l-pcre2-10.44' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.52907369Z [inf]  copying path '/nix/store/c2njy6bv84kw1i4bjf5k5gn7gz8hn57n-xz-5.6.3' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.533159605Z [inf]  copying path '/nix/store/cqlaa2xf6lslnizyj9xqa8j0ii1yqw0x-zlib-1.3.1' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.5343824Z [inf]  copying path '/nix/store/dz97fw51rm5bl9kz1vg0haj1j1a7r1mr-nghttp2-1.64.0-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.535369988Z [inf]  copying path '/nix/store/ll14czvpxglf6nnwmmrmygplm830fvlv-libuv-1.49.2-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.545440492Z [inf]  copying path '/nix/store/9cwwj1c9csmc85l2cqzs3h9hbf1vwl6c-gnutar-1.35' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.547383986Z [inf]  copying path '/nix/store/df2a8k58k00f2dh2x930dg6xs6g6mliv-binutils-2.43.1-lib' from 'https://cache.nixos.org'...
copying path '/nix/store/c4rj90r2m89rxs64hmm857mipwjhig5d-file-5.46' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.547440237Z [inf]  copying path '/nix/store/1lggwqzapn5mn49l9zy4h566ysv9kzdb-zlib-1.3.1-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.602906968Z [inf]  copying path '/nix/store/qs22aazzrdd4dnjf9vffl0n31hvls43h-mpfr-4.2.1' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.603001201Z [inf]  copying path '/nix/store/xmbv8s4p4i4dbxgkgdrdfb0ym25wh6gk-isl-0.20' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.608865279Z [inf]  copying path '/nix/store/aap6cq56amx4mzbyxp2wpgsf1kqjcr1f-gnugrep-3.11' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.611309176Z [inf]  copying path '/nix/store/nvvj6sk0k6px48436drlblf4gafgbvzr-gzip-1.13' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.611636389Z [inf]  copying path '/nix/store/h18s640fnhhj2qdh5vivcfbxvz377srg-xz-5.6.3-bin' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.63823581Z [inf]  copying path '/nix/store/kj8hbqx4ds9qm9mq7hyikxyfwwg13kzj-glibc-2.40-36-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.658666956Z [inf]  copying path '/nix/store/2a3anh8vl3fcgk0fvaravlimrqawawza-libmpc-1.3.1' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.742416829Z [inf]  copying path '/nix/store/j7p46r8v9gcpbxx89pbqlh61zhd33gzv-binutils-2.43.1' from 'https://cache.nixos.org'...
copying path '/nix/store/l89iqc7am6i60y8vk507zwrzxf0wcd3v-gcc-14-20241116' from 'https://cache.nixos.org'...
copying path '/nix/store/wwipgdqb4p2fr46kmw9c5wlk799kbl68-icu4c-74.2' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.742435324Z [inf]  copying path '/nix/store/a2byxfv4lc8f2g5xfzw8cz5q8k05wi29-gmp-with-cxx-6.3.0' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.742582167Z [inf]  copying path '/nix/store/srfxqk119fijwnprgsqvn68ys9kiw0bn-patchelf-0.15.0' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.747669406Z [inf]  copying path '/nix/store/lygl27c44xv73kx1spskcgvzwq7z337c-openssl-3.3.2-bin' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.751632755Z [inf]  copying path '/nix/store/v9c1s50x7magpiqgycxxkn36avzbcg0g-krb5-1.21.3-lib' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.751734806Z [inf]  copying path '/nix/store/8675pnfr4fqnwv4pzjl67hdwls4q13aa-libssh2-1.11.1' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.751750683Z [inf]  copying path '/nix/store/qq5q0alyzywdazhmybi7m69akz0ppk05-openssl-3.3.2-bin' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.776774184Z [inf]  copying path '/nix/store/4s9rah4cwaxflicsk5cndnknqlk9n4p3-coreutils-9.5' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.790806599Z [inf]  copying path '/nix/store/pp2zf8bdgyz60ds8vcshk2603gcjgp72-openssl-3.3.2-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.803807601Z [inf]  copying path '/nix/store/kqm7wpqkzc4bwjlzqizcbz0mgkj06a9x-openssl-3.3.2-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.848098245Z [inf]  copying path '/nix/store/pkc7mb4a4qvyz73srkqh4mwl70w98dsv-curl-8.11.0' from 'https://cache.nixos.org'...
copying path '/nix/store/milph81dilrh96isyivh5n50agpx39k2-krb5-1.21.3' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.851934637Z [inf]  copying path '/nix/store/00g69vw7c9lycy63h45ximy0wmzqx5y6-diffutils-3.10' from 'https://cache.nixos.org'...
copying path '/nix/store/jqrz1vq5nz4lnv9pqzydj0ir58wbjfy1-findutils-4.10.0' from 'https://cache.nixos.org'...
copying path '/nix/store/1i003ijlh9i0mzp6alqby5hg3090pjdx-perl-5.40.0' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.939941853Z [inf]  copying path '/nix/store/b56mswksrql15knpb1bnhv3ysif340kd-krb5-1.21.3-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.94576736Z [inf]  copying path '/nix/store/p123cq20klajcl9hj8jnkjip5nw6awhz-curl-8.11.0-bin' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.960755367Z [inf]  copying path '/nix/store/4ig84cyqi6qy4n0sanrbzsw1ixa497jx-stdenv-linux' from 'https://cache.nixos.org'...

2026-01-26T21:34:05.971213568Z [inf]  copying path '/nix/store/d7zhcrcc7q3yfbm3qkqpgc3daq82spwi-libssh2-1.11.1-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:06.038440783Z [inf]  building '/nix/store/1f4a312hz9m6y1ssip52drgkim8az4d6-libraries.drv'...

2026-01-26T21:34:06.041310913Z [inf]  copying path '/nix/store/5f5linrxzhhb3mrclkwdpm9bd8ygldna-curl-8.11.0-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:06.119888813Z [inf]  building '/nix/store/6vy68gykpxfphbmmyd59ya88xvrwvvaa-npm-9.9.4.tgz.drv'...

2026-01-26T21:34:06.343456079Z [inf]  building '/nix/store/79g4v87v1cgrx5vlwzcagcs6v8ps8fk2-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env.drv'...

2026-01-26T21:34:06.481952135Z [inf]  
trying https://registry.npmjs.org/npm/-/npm-9.9.4.tgz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

2026-01-26T21:34:06.482243949Z [inf]  copying path '/nix/store/srcmmqi8kxjfygd0hyy42c8hv6cws83b-binutils-wrapper-2.43.1' from 'https://cache.nixos.org'...

2026-01-26T21:34:06.614414347Z [inf]  100 2648k  100 2648k    0     0  15.6M      0 --:--:-- --:--:-- --:--:-- 15.6M

2026-01-26T21:34:06.746901936Z [inf]  copying path '/nix/store/m8w3mf0i4862q22bxad0wspkgdy4jnkk-icu4c-74.2-dev' from 'https://cache.nixos.org'...

2026-01-26T21:34:06.975635542Z [inf]  copying path '/nix/store/j7dx1n6m5axf9r2bvly580x2ixx546wq-nodejs-20.18.1' from 'https://cache.nixos.org'...

2026-01-26T21:34:11.054984611Z [inf]  copying path '/nix/store/xcn9p4xxfbvlkpah7pwchpav4ab9d135-gcc-wrapper-14-20241116' from 'https://cache.nixos.org'...

2026-01-26T21:34:11.065277759Z [inf]  copying path '/nix/store/d0gfdcag8bxzvg7ww4s7px4lf8sxisyx-stdenv-linux' from 'https://cache.nixos.org'...

2026-01-26T21:34:11.115925938Z [inf]  building '/nix/store/w9h0z1lhfwxc0m38f3w5brfdqrzm4wyj-npm.drv'...

2026-01-26T21:34:11.186801955Z [inf]  Running phase: unpackPhase

2026-01-26T21:34:11.192191348Z [inf]  unpacking source archive /nix/store/fkd1ma3nify8r9wp463yg5rqz9hdcyf1-npm-9.9.4.tgz

2026-01-26T21:34:11.347464352Z [inf]  source root is package

2026-01-26T21:34:11.406791997Z [inf]  setting SOURCE_DATE_EPOCH to timestamp 499162500 of file package/package.json

2026-01-26T21:34:11.413263881Z [inf]  Running phase: installPhase

2026-01-26T21:34:12.329516968Z [inf]  building '/nix/store/j35hwrlsfar9sl236alrb60mcvhxqyp7-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env.drv'...

2026-01-26T21:34:12.43664293Z [inf]  created 33 symlinks in user environment

2026-01-26T21:34:12.559431976Z [inf]  building '/nix/store/v021qhh1c1k8bgpkfyw67ms57h3ah1pm-user-environment.drv'...

2026-01-26T21:34:12.817731933Z [inf]  removing old generations of profile /nix/var/nix/profiles/per-user/root/channels

2026-01-26T21:34:12.818086754Z [inf]  removing old generations of profile /nix/var/nix/profiles/per-user/root/profile

2026-01-26T21:34:12.818238233Z [inf]  removing profile version 1

2026-01-26T21:34:12.81854619Z [inf]  removing old generations of profile /nix/var/nix/profiles/per-user/root/channels

2026-01-26T21:34:12.818700103Z [inf]  removing old generations of profile /nix/var/nix/profiles/per-user/root/profile

2026-01-26T21:34:12.823715988Z [inf]  finding garbage collector roots...

2026-01-26T21:34:12.823815494Z [inf]  removing stale link from '/nix/var/nix/gcroots/auto/lzjbmb2ry0z7lma2fvpqprb12921pnb5' to '/nix/var/nix/profiles/per-user/root/profile-1-link'

2026-01-26T21:34:12.832760368Z [inf]  deleting garbage...

2026-01-26T21:34:12.839111503Z [inf]  deleting '/nix/store/a9qf4wwhympzs35ncp80r185j6a21w07-user-environment'

2026-01-26T21:34:12.85651883Z [inf]  deleting '/nix/store/253kwn1730vnay87xkjgxa2v97w3y079-user-environment.drv'

2026-01-26T21:34:12.856754235Z [inf]  deleting '/nix/store/hn5mrh362n52x8wwab9s1v6bgn4n5c94-env-manifest.nix'

2026-01-26T21:34:12.857318021Z [inf]  deleting '/nix/store/d0gfdcag8bxzvg7ww4s7px4lf8sxisyx-stdenv-linux'

2026-01-26T21:34:12.857622466Z [inf]  deleting '/nix/store/4ig84cyqi6qy4n0sanrbzsw1ixa497jx-stdenv-linux'

2026-01-26T21:34:12.857834092Z [inf]  deleting '/nix/store/h18s640fnhhj2qdh5vivcfbxvz377srg-xz-5.6.3-bin'

2026-01-26T21:34:12.858352011Z [inf]  deleting '/nix/store/9cwwj1c9csmc85l2cqzs3h9hbf1vwl6c-gnutar-1.35'

2026-01-26T21:34:12.863090041Z [inf]  deleting '/nix/store/nvvj6sk0k6px48436drlblf4gafgbvzr-gzip-1.13'

2026-01-26T21:34:12.863642854Z [inf]  deleting '/nix/store/5f5linrxzhhb3mrclkwdpm9bd8ygldna-curl-8.11.0-dev'

2026-01-26T21:34:12.864224352Z [inf]  deleting '/nix/store/d7zhcrcc7q3yfbm3qkqpgc3daq82spwi-libssh2-1.11.1-dev'

2026-01-26T21:34:12.864540891Z [inf]  deleting '/nix/store/kqm7wpqkzc4bwjlzqizcbz0mgkj06a9x-openssl-3.3.2-dev'

2026-01-26T21:34:12.866733848Z [inf]  deleting '/nix/store/qq5q0alyzywdazhmybi7m69akz0ppk05-openssl-3.3.2-bin'

2026-01-26T21:34:12.866976838Z [inf]  deleting '/nix/store/fp6cjl1zcmm6mawsnrb5yak1wkz2ma8l-gnumake-4.4.1'

2026-01-26T21:34:12.869376411Z [inf]  deleting '/nix/store/jqrz1vq5nz4lnv9pqzydj0ir58wbjfy1-findutils-4.10.0'

2026-01-26T21:34:12.872264455Z [inf]  deleting '/nix/store/wf5zj2gbib3gjqllkabxaw4dh0gzcla3-builder.pl'

2026-01-26T21:34:12.872469443Z [inf]  deleting '/nix/store/1i003ijlh9i0mzp6alqby5hg3090pjdx-perl-5.40.0'

2026-01-26T21:34:12.906381445Z [inf]  deleting '/nix/store/lwi59jcfwk2lnrakmm1y5vw85hj3n1bi-source'

2026-01-26T21:34:14.593533484Z [inf]  deleting '/nix/store/dz97fw51rm5bl9kz1vg0haj1j1a7r1mr-nghttp2-1.64.0-dev'

2026-01-26T21:34:14.593999865Z [inf]  deleting '/nix/store/grixvx878884hy8x3xs0c0s1i00j632k-nghttp2-1.64.0'

2026-01-26T21:34:14.594605935Z [inf]  deleting '/nix/store/xcn9p4xxfbvlkpah7pwchpav4ab9d135-gcc-wrapper-14-20241116'

2026-01-26T21:34:14.595563015Z [inf]  deleting '/nix/store/l89iqc7am6i60y8vk507zwrzxf0wcd3v-gcc-14-20241116'

2026-01-26T21:34:14.622528046Z [inf]  deleting '/nix/store/xmbv8s4p4i4dbxgkgdrdfb0ym25wh6gk-isl-0.20'

2026-01-26T21:34:14.624274098Z [inf]  deleting '/nix/store/p123cq20klajcl9hj8jnkjip5nw6awhz-curl-8.11.0-bin'

2026-01-26T21:34:14.625756426Z [inf]  deleting '/nix/store/pkc7mb4a4qvyz73srkqh4mwl70w98dsv-curl-8.11.0'

2026-01-26T21:34:14.626958658Z [inf]  deleting '/nix/store/b56mswksrql15knpb1bnhv3ysif340kd-krb5-1.21.3-dev'

2026-01-26T21:34:14.628242509Z [inf]  deleting '/nix/store/milph81dilrh96isyivh5n50agpx39k2-krb5-1.21.3'

2026-01-26T21:34:14.629801119Z [inf]  deleting '/nix/store/v9c1s50x7magpiqgycxxkn36avzbcg0g-krb5-1.21.3-lib'

2026-01-26T21:34:14.631480462Z [inf]  deleting '/nix/store/2wh1gqyzf5xsvxpdz2k0bxiz583wwq29-keyutils-1.6.3-lib'

2026-01-26T21:34:14.632128493Z [inf]  deleting '/nix/store/abm77lnrkrkb58z6xp1qwjcr1xgkcfwm-gnused-4.9'

2026-01-26T21:34:14.635863277Z [inf]  deleting '/nix/store/fv7gpnvg922frkh81w5hkdhpz0nw3iiz-mirrors-list'

2026-01-26T21:34:14.63615832Z [inf]  deleting '/nix/store/mglixp03lsp0w986svwdvm7vcy17rdax-bzip2-1.0.8-bin'

2026-01-26T21:34:14.636777305Z [inf]  deleting '/nix/store/2a3anh8vl3fcgk0fvaravlimrqawawza-libmpc-1.3.1'

2026-01-26T21:34:14.637347106Z [inf]  deleting '/nix/store/qs22aazzrdd4dnjf9vffl0n31hvls43h-mpfr-4.2.1'

2026-01-26T21:34:14.637908611Z [inf]  deleting '/nix/store/aap6cq56amx4mzbyxp2wpgsf1kqjcr1f-gnugrep-3.11'

2026-01-26T21:34:14.641222673Z [inf]  deleting '/nix/store/c4rj90r2m89rxs64hmm857mipwjhig5d-file-5.46'

2026-01-26T21:34:14.641741714Z [inf]  deleting '/nix/store/a3c47r5z1q2c4rz0kvq8hlilkhx2s718-gawk-5.3.1'

2026-01-26T21:34:14.645160563Z [inf]  deleting '/nix/store/srcmmqi8kxjfygd0hyy42c8hv6cws83b-binutils-wrapper-2.43.1'

2026-01-26T21:34:14.645783653Z [inf]  deleting '/nix/store/kj8hbqx4ds9qm9mq7hyikxyfwwg13kzj-glibc-2.40-36-dev'

2026-01-26T21:34:14.652633727Z [inf]  deleting '/nix/store/1c6bmxrrhm8bd26ai2rjqld2yyjrxhds-glibc-2.40-36-bin'

2026-01-26T21:34:14.653739435Z [inf]  deleting '/nix/store/8675pnfr4fqnwv4pzjl67hdwls4q13aa-libssh2-1.11.1'

2026-01-26T21:34:14.654885181Z [inf]  deleting '/nix/store/9l9n7a0v4aibcz0sgd0crs209an9p7dz-openssl-3.3.2'

2026-01-26T21:34:14.655708994Z [inf]  deleting '/nix/store/5yja5dpk2qw1v5mbfbl2d7klcdfrh90w-patch-2.7.6'

2026-01-26T21:34:14.656135922Z [inf]  deleting '/nix/store/74h4z8k82pmp24xryflv4lxkz8jlpqqd-ed-1.20.2'

2026-01-26T21:34:14.656730131Z [inf]  deleting '/nix/store/pc74azbkr19rkd5bjalq2xwx86cj3cga-linux-headers-6.12'

2026-01-26T21:34:14.66989874Z [inf]  deleting '/nix/store/c2njy6bv84kw1i4bjf5k5gn7gz8hn57n-xz-5.6.3'

2026-01-26T21:34:14.672240618Z [inf]  deleting '/nix/store/3j1p598fivxs69wx3a657ysv3rw8k06l-pcre2-10.44'

2026-01-26T21:34:14.672599526Z [inf]  deleting '/nix/store/w03v94xpvkni794qvd12x2l76gyhm9wv-source'

2026-01-26T21:34:14.673687612Z [inf]  deleting '/nix/store/j7p46r8v9gcpbxx89pbqlh61zhd33gzv-binutils-2.43.1'

2026-01-26T21:34:14.678152869Z [inf]  deleting '/nix/store/srfxqk119fijwnprgsqvn68ys9kiw0bn-patchelf-0.15.0'

2026-01-26T21:34:14.678716559Z [inf]  deleting '/nix/store/df2a8k58k00f2dh2x930dg6xs6g6mliv-binutils-2.43.1-lib'

2026-01-26T21:34:14.679203909Z [inf]  deleting '/nix/store/9fxr7753z31rn59i64dqaajgsx0ap91p-libraries'

2026-01-26T21:34:14.679552015Z [inf]  deleting '/nix/store/d29r1bdmlvwmj52apgcdxfl1mm9c5782-update-autotools-gnu-config-scripts-hook'

2026-01-26T21:34:14.679848198Z [inf]  deleting '/nix/store/qcghigzrz56vczwlzg9c02vbs6zr9jkz-nghttp2-1.64.0-lib'

2026-01-26T21:34:14.680325003Z [inf]  deleting '/nix/store/00g69vw7c9lycy63h45ximy0wmzqx5y6-diffutils-3.10'

2026-01-26T21:34:14.6837045Z [inf]  deleting '/nix/store/agvks3qmzja0yj54szi3vja6vx3cwkkw-curl-8.11.0-man'

2026-01-26T21:34:14.683964562Z [inf]  deleting '/nix/store/1m67ipsk39xvhyqrxnzv2m2p48pil8kl-gnu-config-2024-01-01'

2026-01-26T21:34:14.684333944Z [inf]  deleting '/nix/store/6cr0spsvymmrp1hj5n0kbaxw55w1lqyp-libxcrypt-4.4.36'

2026-01-26T21:34:14.684945487Z [inf]  deleting '/nix/store/ivl2v8rgg7qh1jkj5pwpqycax3rc2hnl-bzip2-1.0.8'

2026-01-26T21:34:14.685343698Z [inf]  deleting '/nix/store/kryrg7ds05iwcmy81amavk8w13y4lxbs-gmp-6.3.0'

2026-01-26T21:34:14.685858043Z [inf]  deleting '/nix/store/fkd1ma3nify8r9wp463yg5rqz9hdcyf1-npm-9.9.4.tgz'

2026-01-26T21:34:14.686084963Z [inf]  deleting '/nix/store/qbry6090vlr9ar33kdmmbq2p5apzbga8-expand-response-params'

2026-01-26T21:34:14.686374517Z [inf]  deleting unused links...

2026-01-26T21:34:17.477224369Z [inf]  note: currently hard linking saves 1.69 MiB

2026-01-26T21:34:17.489860347Z [inf]  61 store paths deleted, 559.41 MiB freed

2026-01-26T21:34:17.559876318Z [inf]  [stage-0  4/10] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
2026-01-26T21:34:17.564018227Z [inf]  [stage-0  5/10] COPY . /app/.
2026-01-26T21:34:17.876969011Z [inf]  [stage-0  5/10] COPY . /app/.
2026-01-26T21:34:17.882270612Z [inf]  [stage-0  6/10] RUN --mount=type=cache,id=s/ac014987-bb5d-407a-9f6f-a65dc67883b7-/root/npm,target=/root/.npm npm ci
2026-01-26T21:34:18.129508907Z [inf]  npm warn config production Use `--omit=dev` instead.

2026-01-26T21:34:18.921007332Z [inf]  npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'pg-boss@12.6.0',
npm warn EBADENGINE   required: { node: '>=22.12.0' },
npm warn EBADENGINE   current: { node: 'v20.18.1', npm: '10.8.2' }
npm warn EBADENGINE }

2026-01-26T21:34:41.139560526Z [inf]  
added 498 packages, and audited 499 packages in 23s

2026-01-26T21:34:41.139754449Z [inf]  
157 packages are looking for funding
  run `npm fund` for details

2026-01-26T21:34:41.142554078Z [inf]  
found 0 vulnerabilities

2026-01-26T21:34:41.510365555Z [inf]  [stage-0  6/10] RUN --mount=type=cache,id=s/ac014987-bb5d-407a-9f6f-a65dc67883b7-/root/npm,target=/root/.npm npm ci
2026-01-26T21:34:41.512090140Z [inf]  [stage-0  7/10] COPY . /app/.
2026-01-26T21:34:45.243199533Z [inf]  [stage-0  7/10] COPY . /app/.
2026-01-26T21:34:45.247257477Z [inf]  [stage-0  8/10] RUN --mount=type=cache,id=s/ac014987-bb5d-407a-9f6f-a65dc67883b7-next/cache,target=/app/.next/cache --mount=type=cache,id=s/ac014987-bb5d-407a-9f6f-a65dc67883b7-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-01-26T21:34:45.542163529Z [inf]  npm warn config production Use `--omit=dev` instead.

2026-01-26T21:34:45.567992778Z [inf]  
> plebtest@0.1.0 build
> next build


2026-01-26T21:34:47.047225851Z [inf]  Attention: Next.js now collects completely anonymous telemetry regarding usage.

2026-01-26T21:34:47.048033154Z [inf]  This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

2026-01-26T21:34:47.048072805Z [inf]  

2026-01-26T21:34:47.08032326Z [inf]  ▲ Next.js 16.1.4 (Turbopack)

2026-01-26T21:34:47.080495812Z [inf]  

2026-01-26T21:34:47.087371203Z [inf]  ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

2026-01-26T21:34:47.237345749Z [inf]    Creating an optimized production build ...

2026-01-26T21:34:54.597242634Z [inf]  ✓ Compiled successfully in 6.5s

2026-01-26T21:34:54.618686857Z [inf]    Running TypeScript ...

2026-01-26T21:35:06.616734118Z [inf]    Collecting page data using 47 workers ...

2026-01-26T21:35:09.981284345Z [inf]  Error: Neither apiKey nor config.authenticator provided
    at r._setAuthenticator (.next/server/chunks/[root-of-the-server]__45acb71f._.js:1:126089)
    at new r (.next/server/chunks/[root-of-the-server]__45acb71f._.js:1:120684)
    at module evaluation (.next/server/chunks/[root-of-the-server]__45acb71f._.js:1:129960)
    at instantiateModule (.next/server/chunks/[turbopack]_runtime.js:740:9)
    at instantiateRuntimeModule (.next/server/chunks/[turbopack]_runtime.js:768:12)
    at getOrInstantiateRuntimeModule (.next/server/chunks/[turbopack]_runtime.js:781:12)
    at Object.m (.next/server/chunks/[turbopack]_runtime.js:790:18)
    at Object.<anonymous> (.next/server/app/api/webhooks/stripe/route.js:8:3)

2026-01-26T21:35:10.116878979Z [inf]  

2026-01-26T21:35:10.116906903Z [inf]  > Build error occurred

2026-01-26T21:35:10.124029647Z [inf]  Error: Failed to collect page data for /api/webhooks/stripe
    at ignore-listed frames {
  type: 'Error'
}

2026-01-26T21:35:10.408302295Z [err]  [stage-0  8/10] RUN --mount=type=cache,id=s/ac014987-bb5d-407a-9f6f-a65dc67883b7-next/cache,target=/app/.next/cache --mount=type=cache,id=s/ac014987-bb5d-407a-9f6f-a65dc67883b7-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-01-26T21:35:10.434287356Z [err]  Dockerfile:24
2026-01-26T21:35:10.434351302Z [err]  -------------------
2026-01-26T21:35:10.434360793Z [err]  22 |     # build phase
2026-01-26T21:35:10.434366804Z [err]  23 |     COPY . /app/.
2026-01-26T21:35:10.434376697Z [err]  24 | >>> RUN --mount=type=cache,id=s/ac014987-bb5d-407a-9f6f-a65dc67883b7-next/cache,target=/app/.next/cache --mount=type=cache,id=s/ac014987-bb5d-407a-9f6f-a65dc67883b7-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-01-26T21:35:10.434382685Z [err]  25 |
2026-01-26T21:35:10.434388100Z [err]  26 |
2026-01-26T21:35:10.434394356Z [err]  -------------------
2026-01-26T21:35:10.434401578Z [err]  ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c npm run build" did not complete successfully: exit code: 1
2026-01-26T21:35:10.444071754Z [err]  Error: Docker build failed
