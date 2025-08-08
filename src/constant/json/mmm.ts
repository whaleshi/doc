/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/mmm.json`.
 */
export type Mmm = {
  "address": "mmmBS4EdwiWqiJ8acVXfB5MprWtmTVMfcqCmGX4rzGd",
  "metadata": {
    "name": "mmm",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "MMM Contract"
  },
  "instructions": [
    {
      "name": "claimHuntGold",
      "discriminator": [
        85,
        137,
        80,
        144,
        53,
        123,
        9,
        218
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "token_vault.mint",
                "account": "tokenVault"
              }
            ]
          }
        },
        {
          "name": "userStake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "token_vault.mint",
                "account": "tokenVault"
              }
            ]
          }
        },
        {
          "name": "userTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_vault.mint",
                "account": "tokenVault"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault_token_account.mint",
                "account": "tokenAccount"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": []
    },
    {
      "name": "claimRedPacket",
      "discriminator": [
        1,
        255,
        242,
        87,
        21,
        112,
        206,
        239
      ],
      "accounts": [
        {
          "name": "recipient",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault_token_account.mint",
                "account": "tokenAccount"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault_token_account.mint",
                "account": "tokenAccount"
              }
            ]
          }
        },
        {
          "name": "recipientTokenAccount",
          "writable": true
        },
        {
          "name": "orderClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114,
                  95,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "args.order_id"
              }
            ]
          }
        },
        {
          "name": "firstLevelReferrerTokenAccount",
          "docs": [
            "First level referrer's token account (optional)"
          ],
          "writable": true,
          "optional": true
        },
        {
          "name": "secondLevelReferrerTokenAccount",
          "docs": [
            "Second level referrer's token account (optional)"
          ],
          "writable": true,
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "claimRedPacketArgs"
            }
          }
        }
      ]
    },
    {
      "name": "claimRedPacket2",
      "discriminator": [
        16,
        41,
        144,
        170,
        175,
        250,
        235,
        77
      ],
      "accounts": [
        {
          "name": "recipient",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault_token_account.mint",
                "account": "tokenAccount"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault_token_account.mint",
                "account": "tokenAccount"
              }
            ]
          }
        },
        {
          "name": "recipientTokenAccount",
          "writable": true
        },
        {
          "name": "orderClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114,
                  95,
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "args.order_id"
              }
            ]
          }
        },
        {
          "name": "firstLevelReferrerTokenAccount",
          "docs": [
            "First level referrer's token account (optional)"
          ],
          "writable": true,
          "optional": true
        },
        {
          "name": "secondLevelReferrerTokenAccount",
          "docs": [
            "Second level referrer's token account (optional)"
          ],
          "writable": true,
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "claimRedPacket2Args"
            }
          }
        }
      ]
    },
    {
      "name": "createMeteoraPool",
      "discriminator": [
        246,
        254,
        33,
        37,
        225,
        176,
        41,
        232
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "docs": [
            "The token mint to create pool for (regular SPL token)"
          ]
        },
        {
          "name": "adminTokenAccount",
          "docs": [
            "Admin's token account"
          ],
          "writable": true
        },
        {
          "name": "adminWsolAccount",
          "docs": [
            "Admin's WSOL account"
          ],
          "writable": true
        },
        {
          "name": "positionNftMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "positionNftAccount",
          "writable": true
        },
        {
          "name": "poolAuthority"
        },
        {
          "name": "pool",
          "writable": true
        },
        {
          "name": "position",
          "writable": true
        },
        {
          "name": "wsolMint",
          "docs": [
            "WSOL mint (native SOL)"
          ]
        },
        {
          "name": "tokenAVault",
          "writable": true
        },
        {
          "name": "tokenBVault",
          "writable": true
        },
        {
          "name": "meteoraEventAuthority"
        },
        {
          "name": "meteoraDammV2Program"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "token2022Program",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createMeteoraPoolParams"
            }
          }
        }
      ]
    },
    {
      "name": "createToken",
      "discriminator": [
        84,
        52,
        204,
        228,
        24,
        140,
        234,
        75
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "metadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "metadataProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "metadataProgram"
            }
          }
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "deposit",
      "discriminator": [
        242,
        35,
        198,
        137,
        82,
        225,
        242,
        182
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "userTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "programConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "feeRecipient",
          "writable": true
        },
        {
          "name": "feeRecipientTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "feeRecipient"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "depositArgs"
            }
          }
        }
      ]
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "programConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initializeConfigArgs"
            }
          }
        }
      ]
    },
    {
      "name": "permanentLockPosition",
      "discriminator": [
        165,
        176,
        125,
        6,
        231,
        171,
        186,
        213
      ],
      "accounts": [
        {
          "name": "config",
          "docs": [
            "The program config account"
          ]
        },
        {
          "name": "positionOwner",
          "docs": [
            "The position owner who is locking their liquidity (must be platform)"
          ],
          "signer": true
        },
        {
          "name": "meteoraPool",
          "docs": [
            "Meteora DAMM V2 pool account"
          ],
          "writable": true
        },
        {
          "name": "meteoraPosition",
          "docs": [
            "Meteora position account to be locked"
          ],
          "writable": true
        },
        {
          "name": "positionNftAccount",
          "docs": [
            "Position NFT token account"
          ]
        },
        {
          "name": "meteoraProgram",
          "docs": [
            "Meteora DAMM V2 program"
          ]
        },
        {
          "name": "meteoraEventAuthority",
          "docs": [
            "Meteora event authority PDA"
          ]
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "permanentLockPositionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "refundHuntGold",
      "discriminator": [
        59,
        55,
        113,
        133,
        109,
        77,
        151,
        152
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "token_vault.mint",
                "account": "tokenVault"
              }
            ]
          }
        },
        {
          "name": "userStake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "token_vault.mint",
                "account": "tokenVault"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": []
    },
    {
      "name": "stakeHuntGold",
      "discriminator": [
        39,
        68,
        57,
        215,
        9,
        68,
        112,
        186
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "token_vault.mint",
                "account": "tokenVault"
              }
            ]
          }
        },
        {
          "name": "userStake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "token_vault.mint",
                "account": "tokenVault"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "stakeHuntGoldArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateConfig",
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "programConfig"
          ]
        },
        {
          "name": "programConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateConfigArgs"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawFromVault",
      "discriminator": [
        180,
        34,
        37,
        46,
        156,
        0,
        211,
        238
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault_token_account.mint",
                "account": "tokenAccount"
              }
            ]
          }
        },
        {
          "name": "vaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault_token_account.mint",
                "account": "tokenAccount"
              }
            ]
          }
        },
        {
          "name": "recipientTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "orderClaim",
      "discriminator": [
        163,
        80,
        192,
        16,
        193,
        200,
        138,
        191
      ]
    },
    {
      "name": "programConfig",
      "discriminator": [
        196,
        210,
        90,
        231,
        144,
        149,
        140,
        63
      ]
    },
    {
      "name": "tokenVault",
      "discriminator": [
        121,
        7,
        84,
        254,
        151,
        228,
        43,
        144
      ]
    },
    {
      "name": "userStake",
      "discriminator": [
        102,
        53,
        163,
        107,
        9,
        138,
        87,
        153
      ]
    }
  ],
  "events": [
    {
      "name": "claimHuntGoldEvent",
      "discriminator": [
        237,
        111,
        166,
        234,
        80,
        119,
        80,
        119
      ]
    },
    {
      "name": "claimRedPacket2Event",
      "discriminator": [
        10,
        106,
        173,
        233,
        200,
        15,
        239,
        216
      ]
    },
    {
      "name": "claimRedPacketEvent",
      "discriminator": [
        189,
        251,
        191,
        44,
        59,
        183,
        171,
        9
      ]
    },
    {
      "name": "createMeteoraPoolEvent",
      "discriminator": [
        175,
        17,
        75,
        230,
        240,
        109,
        207,
        245
      ]
    },
    {
      "name": "depositEvent",
      "discriminator": [
        120,
        248,
        61,
        83,
        31,
        142,
        107,
        144
      ]
    },
    {
      "name": "permanentLockPositionEvent",
      "discriminator": [
        144,
        187,
        217,
        185,
        218,
        37,
        116,
        19
      ]
    },
    {
      "name": "refundHuntGoldEvent",
      "discriminator": [
        50,
        138,
        41,
        27,
        203,
        79,
        99,
        189
      ]
    },
    {
      "name": "stakeHuntGoldEvent",
      "discriminator": [
        19,
        108,
        100,
        202,
        234,
        114,
        4,
        178
      ]
    },
    {
      "name": "tokenCreatedEvent",
      "discriminator": [
        96,
        122,
        113,
        138,
        50,
        227,
        149,
        57
      ]
    },
    {
      "name": "withdrawFromVaultEvent",
      "discriminator": [
        103,
        222,
        159,
        174,
        11,
        33,
        109,
        119
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidParameter",
      "msg": "Invalid parameter"
    },
    {
      "code": 6001,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6002,
      "name": "programConfigAlreadyInitialized",
      "msg": "Program config already initialized"
    },
    {
      "code": 6003,
      "name": "invalidSignature",
      "msg": "Invalid signature"
    },
    {
      "code": 6004,
      "name": "notInRedPacketPhase",
      "msg": "Not in red packet phase"
    },
    {
      "code": 6005,
      "name": "notInHuntPhase",
      "msg": "Not in hunt phase"
    },
    {
      "code": 6006,
      "name": "huntPhaseNotEnded",
      "msg": "Hunt phase not ended"
    },
    {
      "code": 6007,
      "name": "alreadyClaimed",
      "msg": "Already claimed"
    },
    {
      "code": 6008,
      "name": "noStake",
      "msg": "No stake"
    },
    {
      "code": 6009,
      "name": "stakeThresholdNotMet",
      "msg": "Stake threshold not met"
    },
    {
      "code": 6010,
      "name": "stakeThresholdMet",
      "msg": "Stake threshold met"
    },
    {
      "code": 6011,
      "name": "redPacketLimitExceeded",
      "msg": "Red packet limit exceeded"
    },
    {
      "code": 6012,
      "name": "claimExpired",
      "msg": "Claim expired"
    },
    {
      "code": 6013,
      "name": "invalidProgram",
      "msg": "Invalid program"
    },
    {
      "code": 6014,
      "name": "invalidFee",
      "msg": "Invalid fee"
    },
    {
      "code": 6015,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6016,
      "name": "insufficientTokens",
      "msg": "Insufficient tokens"
    },
    {
      "code": 6017,
      "name": "insufficientSol",
      "msg": "Insufficient SOL"
    },
    {
      "code": 6018,
      "name": "invalidPlatform",
      "msg": "Invalid platform"
    }
  ],
  "types": [
    {
      "name": "claimHuntGoldEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "claimedAmount",
            "type": "u64"
          },
          {
            "name": "userTotalStaked",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "claimRedPacket2Args",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "signature",
            "type": {
              "array": [
                "u8",
                65
              ]
            }
          }
        ]
      }
    },
    {
      "name": "claimRedPacket2Event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "recipientAmount",
            "type": "u64"
          },
          {
            "name": "firstLevelReferrer",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "firstLevelReward",
            "type": "u64"
          },
          {
            "name": "secondLevelReferrer",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "secondLevelReward",
            "type": "u64"
          },
          {
            "name": "redPacketClaimedAmount",
            "type": "u64"
          },
          {
            "name": "totalSolRedPacket",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "claimRedPacketArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "signature",
            "type": {
              "array": [
                "u8",
                65
              ]
            }
          }
        ]
      }
    },
    {
      "name": "claimRedPacketEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "recipientAmount",
            "type": "u64"
          },
          {
            "name": "firstLevelReferrer",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "firstLevelReward",
            "type": "u64"
          },
          {
            "name": "secondLevelReferrer",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "secondLevelReward",
            "type": "u64"
          },
          {
            "name": "redPacketClaimedAmount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "createMeteoraPoolEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "poolAddress",
            "type": "pubkey"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "feeBps",
            "type": "u16"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "createMeteoraPoolParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sqrtMinPrice",
            "type": "u128"
          },
          {
            "name": "sqrtMaxPrice",
            "type": "u128"
          },
          {
            "name": "sqrtPrice",
            "type": "u128"
          },
          {
            "name": "liquidity",
            "type": "u128"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "wsolAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "depositArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "string"
          },
          {
            "name": "command",
            "type": "string"
          },
          {
            "name": "extraInfo",
            "type": "string"
          },
          {
            "name": "maxIndex",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "cost",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "depositEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "cost",
            "type": "u64"
          },
          {
            "name": "orderId",
            "type": "string"
          },
          {
            "name": "command",
            "type": "string"
          },
          {
            "name": "extraInfo",
            "type": "string"
          },
          {
            "name": "maxIndex",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initializeConfigArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "platform",
            "type": "pubkey"
          },
          {
            "name": "feeRecipient",
            "type": "pubkey"
          },
          {
            "name": "supply",
            "type": "u64"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "adminPubkey",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "redPacketDuration",
            "type": "u32"
          },
          {
            "name": "huntingDuration",
            "type": "u32"
          },
          {
            "name": "redPacketToHuntingDelay",
            "type": "u32"
          },
          {
            "name": "huntGoldStakeThreshold",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "orderClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "claimedAt",
            "type": "i64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "permanentLockPositionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permanentLockLiquidity",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "permanentLockPositionEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "pubkey"
          },
          {
            "name": "position",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "lockLiquidityAmount",
            "type": "u128"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "programConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "platform",
            "type": "pubkey"
          },
          {
            "name": "feeRecipient",
            "type": "pubkey"
          },
          {
            "name": "supply",
            "type": "u64"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "adminPubkey",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "redPacketDuration",
            "type": "u32"
          },
          {
            "name": "huntingDuration",
            "type": "u32"
          },
          {
            "name": "redPacketToHuntingDelay",
            "type": "u32"
          },
          {
            "name": "huntGoldStakeThreshold",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "refundHuntGoldEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "refundAmount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "stakeHuntGoldArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stakeHuntGoldEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "totalStaked",
            "type": "u64"
          },
          {
            "name": "userTotalStaked",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tokenCreatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "uri",
            "type": "string"
          },
          {
            "name": "supply",
            "type": "u64"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "vaultAddress",
            "type": "pubkey"
          },
          {
            "name": "redpacketEndTs",
            "type": "u32"
          },
          {
            "name": "huntGoldStartTs",
            "type": "u32"
          },
          {
            "name": "huntGoldEndTs",
            "type": "u32"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokenVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "u32"
          },
          {
            "name": "redpacketEndTs",
            "type": "u32"
          },
          {
            "name": "huntGoldStartTs",
            "type": "u32"
          },
          {
            "name": "huntGoldEndTs",
            "type": "u32"
          },
          {
            "name": "redPacketClaimedAmount",
            "type": "u64"
          },
          {
            "name": "speed",
            "type": "u64"
          },
          {
            "name": "totalStaked",
            "type": "u64"
          },
          {
            "name": "lastUpdateTime",
            "type": "u32"
          },
          {
            "name": "accRewardPerShare",
            "type": "u128"
          },
          {
            "name": "totalSolRedPacket",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateConfigArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newAdmin",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "newPlatform",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "newFeeRecipient",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "newSupply",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "newDecimals",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "newAdminPubkey",
            "type": {
              "option": {
                "array": [
                  "u8",
                  64
                ]
              }
            }
          },
          {
            "name": "newRedPacketDuration",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "newRedPacketToHuntingDelay",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "newHuntingDuration",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "newHuntGoldStakeThreshold",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "userStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "totalStaked",
            "type": "u64"
          },
          {
            "name": "tokenDebt",
            "type": "u64"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "withdrawFromVaultEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "claimTimeLimit",
      "type": "i64",
      "value": "600"
    },
    {
      "name": "firstLevelReferralPercentage",
      "type": "u64",
      "value": "9"
    },
    {
      "name": "huntPhasePercentage",
      "type": "u64",
      "value": "80"
    },
    {
      "name": "programConfigSeed",
      "type": "string",
      "value": "\"program_config\""
    },
    {
      "name": "secondLevelReferralPercentage",
      "type": "u64",
      "value": "3"
    }
  ]
};
