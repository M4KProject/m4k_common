/* generated : Mon Jun 16 2025 16:05:54 GMT+0200 (heure d’été d’Europe centrale) */

export const _models = [
  {
    "id": "pbc_2279338944",
    "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "name": "_mfas",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text455797646",
        "max": 0,
        "min": 0,
        "name": "collectionRef",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text127846527",
        "max": 0,
        "min": 0,
        "name": "recordRef",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1582905952",
        "max": 0,
        "min": 0,
        "name": "method",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": true,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": true,
        "type": "autodate"
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_mfas_collectionRef_recordRef` ON `_mfas` (collectionRef,recordRef)"
    ],
    "created": "2025-05-23 12:26:47.184Z",
    "updated": "2025-05-28 11:40:11.672Z",
    "system": true
  },
  {
    "id": "pbc_1638494021",
    "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "name": "_otps",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text455797646",
        "max": 0,
        "min": 0,
        "name": "collectionRef",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text127846527",
        "max": 0,
        "min": 0,
        "name": "recordRef",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cost": 8,
        "hidden": true,
        "id": "password901924565",
        "max": 0,
        "min": 0,
        "name": "password",
        "pattern": "",
        "presentable": false,
        "required": true,
        "system": true,
        "type": "password"
      },
      {
        "autogeneratePattern": "",
        "hidden": true,
        "id": "text3866985172",
        "max": 0,
        "min": 0,
        "name": "sentTo",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": true,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": true,
        "type": "autodate"
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_otps_collectionRef_recordRef` ON `_otps` (collectionRef, recordRef)"
    ],
    "created": "2025-05-23 12:26:47.192Z",
    "updated": "2025-05-28 11:40:11.675Z",
    "system": true
  },
  {
    "id": "pbc_2281828961",
    "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "createRule": null,
    "updateRule": null,
    "deleteRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "name": "_externalAuths",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text455797646",
        "max": 0,
        "min": 0,
        "name": "collectionRef",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text127846527",
        "max": 0,
        "min": 0,
        "name": "recordRef",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2462348188",
        "max": 0,
        "min": 0,
        "name": "provider",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1044722854",
        "max": 0,
        "min": 0,
        "name": "providerId",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": true,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": true,
        "type": "autodate"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_externalAuths_record_provider` ON `_externalAuths` (collectionRef, recordRef, provider)",
      "CREATE UNIQUE INDEX `idx_externalAuths_collection_provider` ON `_externalAuths` (collectionRef, provider, providerId)"
    ],
    "created": "2025-05-23 12:26:47.203Z",
    "updated": "2025-05-28 11:40:11.677Z",
    "system": true
  },
  {
    "id": "pbc_4275539003",
    "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "createRule": null,
    "updateRule": null,
    "deleteRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
    "name": "_authOrigins",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text455797646",
        "max": 0,
        "min": 0,
        "name": "collectionRef",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text127846527",
        "max": 0,
        "min": 0,
        "name": "recordRef",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4228609354",
        "max": 0,
        "min": 0,
        "name": "fingerprint",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": true,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": true,
        "type": "autodate"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_authOrigins_unique_pairs` ON `_authOrigins` (collectionRef, recordRef, fingerprint)"
    ],
    "created": "2025-05-23 12:26:47.205Z",
    "updated": "2025-05-28 11:40:11.679Z",
    "system": true
  },
  {
    "id": "pbc_3142635823",
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "name": "_superusers",
    "type": "auth",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cost": 0,
        "hidden": true,
        "id": "password901924565",
        "max": 0,
        "min": 8,
        "name": "password",
        "pattern": "",
        "presentable": false,
        "required": true,
        "system": true,
        "type": "password"
      },
      {
        "autogeneratePattern": "[a-zA-Z0-9]{50}",
        "hidden": true,
        "id": "text2504183744",
        "max": 60,
        "min": 30,
        "name": "tokenKey",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "email3885137012",
        "name": "email",
        "onlyDomains": null,
        "presentable": false,
        "required": true,
        "system": true,
        "type": "email"
      },
      {
        "hidden": false,
        "id": "bool1547992806",
        "name": "emailVisibility",
        "presentable": false,
        "required": false,
        "system": true,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "bool256245529",
        "name": "verified",
        "presentable": false,
        "required": false,
        "system": true,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": true,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": true,
        "type": "autodate"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_pbc_3142635823` ON `_superusers` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_pbc_3142635823` ON `_superusers` (`email`) WHERE `email` != ''"
    ],
    "created": "2025-05-23 12:26:47.208Z",
    "updated": "2025-05-28 11:40:11.680Z",
    "system": true,
    "authRule": "",
    "manageRule": null,
    "authAlert": {
      "enabled": true,
      "emailTemplate": {
        "subject": "Login from a new location",
        "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
      }
    },
    "oauth2": {
      "providers": [],
      "mappedFields": {
        "id": "",
        "name": "",
        "username": "",
        "avatarURL": ""
      },
      "enabled": false
    },
    "passwordAuth": {
      "enabled": true,
      "identityFields": [
        "email"
      ]
    },
    "mfa": {
      "enabled": false,
      "duration": 1800,
      "rule": ""
    },
    "otp": {
      "enabled": false,
      "duration": 180,
      "length": 8,
      "emailTemplate": {
        "subject": "OTP for {APP_NAME}",
        "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
      }
    },
    "authToken": {
      "duration": 86400
    },
    "passwordResetToken": {
      "duration": 1800
    },
    "emailChangeToken": {
      "duration": 1800
    },
    "verificationToken": {
      "duration": 259200
    },
    "fileToken": {
      "duration": 180
    },
    "verificationTemplate": {
      "subject": "Verify your {APP_NAME} email",
      "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
    },
    "resetPasswordTemplate": {
      "subject": "Reset your {APP_NAME} password",
      "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
    },
    "confirmEmailChangeTemplate": {
      "subject": "Confirm your {APP_NAME} new email address",
      "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
    }
  },
  {
    "id": "_pb_users_auth_",
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "id = @request.auth.id",
    "createRule": "",
    "updateRule": "id = @request.auth.id",
    "deleteRule": "id = @request.auth.id",
    "name": "users",
    "type": "auth",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cost": 0,
        "hidden": true,
        "id": "password901924565",
        "max": 0,
        "min": 8,
        "name": "password",
        "pattern": "",
        "presentable": false,
        "required": true,
        "system": true,
        "type": "password"
      },
      {
        "autogeneratePattern": "[a-zA-Z0-9]{50}",
        "hidden": true,
        "id": "text2504183744",
        "max": 60,
        "min": 30,
        "name": "tokenKey",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "email3885137012",
        "name": "email",
        "onlyDomains": null,
        "presentable": false,
        "required": true,
        "system": true,
        "type": "email"
      },
      {
        "hidden": false,
        "id": "bool1547992806",
        "name": "emailVisibility",
        "presentable": false,
        "required": false,
        "system": true,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "bool256245529",
        "name": "verified",
        "presentable": false,
        "required": false,
        "system": true,
        "type": "bool"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1579384326",
        "max": 255,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "file376926767",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/gif",
          "image/webp"
        ],
        "name": "avatar",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": null,
        "type": "file"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2153001328",
        "hidden": false,
        "id": "relation154121870",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "device",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != ''"
    ],
    "created": "2025-05-23 12:26:47.211Z",
    "updated": "2025-06-05 00:01:20.320Z",
    "system": false,
    "authRule": "",
    "manageRule": null,
    "authAlert": {
      "enabled": false,
      "emailTemplate": {
        "subject": "Login from a new location",
        "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
      }
    },
    "oauth2": {
      "providers": [],
      "mappedFields": {
        "id": "",
        "name": "name",
        "username": "",
        "avatarURL": "avatar"
      },
      "enabled": false
    },
    "passwordAuth": {
      "enabled": true,
      "identityFields": [
        "email"
      ]
    },
    "mfa": {
      "enabled": false,
      "duration": 1800,
      "rule": ""
    },
    "otp": {
      "enabled": false,
      "duration": 180,
      "length": 8,
      "emailTemplate": {
        "subject": "OTP for {APP_NAME}",
        "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
      }
    },
    "authToken": {
      "duration": 604800
    },
    "passwordResetToken": {
      "duration": 1800
    },
    "emailChangeToken": {
      "duration": 1800
    },
    "verificationToken": {
      "duration": 259200
    },
    "fileToken": {
      "duration": 180
    },
    "verificationTemplate": {
      "subject": "Verify your {APP_NAME} email",
      "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
    },
    "resetPasswordTemplate": {
      "subject": "Reset your {APP_NAME} password",
      "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
    },
    "confirmEmailChangeTemplate": {
      "subject": "Confirm your {APP_NAME} new email address",
      "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
    }
  },
  {
    "id": "pbc_4105455982",
    "listRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "viewRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "createRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "updateRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "deleteRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "name": "contents",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "bool1001664029",
        "name": "public",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "autogeneratePattern": "[a-z][a-z0-9]{4}",
        "hidden": false,
        "id": "text2324736937",
        "max": 256,
        "min": 3,
        "name": "key",
        "pattern": "^[a-z_][a-z0-9_]+$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text724990059",
        "max": 0,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select2363381545",
        "maxSelect": 1,
        "name": "type",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "empty",
          "form",
          "table",
          "html",
          "playlist",
          "hiboutik",
          "odoo"
        ]
      },
      {
        "hidden": false,
        "id": "json2918445923",
        "maxSize": 0,
        "name": "data",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "file104153177",
        "maxSelect": 99,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "files",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3446931122",
        "hidden": false,
        "id": "relation3926880397",
        "maxSelect": 999,
        "minSelect": 0,
        "name": "medias",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_lI6NdLEj67` ON `contents` (\n  `key`,\n  `group`\n)"
    ],
    "created": "2025-05-23 12:28:50.251Z",
    "updated": "2025-06-16 13:48:00.362Z",
    "system": false
  },
  {
    "id": "pbc_2153001328",
    "listRule": "@request.auth.id != \"\" && (user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10)",
    "viewRule": "@request.auth.id != \"\" && (user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10)",
    "createRule": "@request.auth.id != \"\" && (user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20)",
    "updateRule": "@request.auth.id != \"\" && (user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20)",
    "deleteRule": "@request.auth.id != \"\" && (user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20)",
    "name": "devices",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "date3029767898",
        "max": "",
        "min": "",
        "name": "started",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "date2654125802",
        "max": "",
        "min": "",
        "name": "online",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "autogeneratePattern": "[a-z][a-z0-9]{3}",
        "hidden": false,
        "id": "text2324736937",
        "max": 0,
        "min": 0,
        "name": "key",
        "pattern": "^[a-z_][a-z0-9_]+$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1579384326",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2363381545",
        "max": 0,
        "min": 0,
        "name": "type",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number3206337475",
        "max": null,
        "min": null,
        "name": "version",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number2350531887",
        "max": 9999,
        "min": 0,
        "name": "width",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number4115522831",
        "max": 9999,
        "min": 0,
        "name": "height",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "select1204587666",
        "maxSelect": 1,
        "name": "action",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "reload",
          "restart",
          "reboot",
          "capture",
          "exit",
          "info",
          "ping",
          "js",
          "sh",
          "su",
          "set",
          "kiosk_on",
          "screen_on"
        ]
      },
      {
        "hidden": false,
        "id": "select2063623452",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "started",
          "updated",
          "action_started",
          "action_ended"
        ]
      },
      {
        "hidden": false,
        "id": "json3414765911",
        "maxSize": 0,
        "name": "info",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json3626513111",
        "maxSize": 0,
        "name": "input",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json325763347",
        "maxSize": 0,
        "name": "result",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "file2348721893",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "capture",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_4105455982",
        "hidden": false,
        "id": "relation4274335913",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "content",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_uSAhmUBLwl` ON `devices` (`key`)"
    ],
    "created": "2025-05-23 12:28:50.260Z",
    "updated": "2025-06-13 12:42:11.357Z",
    "system": false
  },
  {
    "id": "pbc_3446931122",
    "listRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "viewRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "createRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "updateRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "deleteRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "name": "medias",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2363381545",
        "max": 0,
        "min": 0,
        "name": "type",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1579384326",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text724990059",
        "max": 0,
        "min": 0,
        "name": "desc",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number4156564586",
        "max": null,
        "min": null,
        "name": "size",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number2350531887",
        "max": null,
        "min": null,
        "name": "width",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number4115522831",
        "max": null,
        "min": null,
        "name": "height",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number2254405824",
        "max": null,
        "min": null,
        "name": "duration",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "file1602912115",
        "maxSelect": 1,
        "maxSize": 500000000,
        "mimeTypes": [],
        "name": "file",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [
          "24x24",
          "48x48",
          "100x100",
          "200x200",
          "360x360",
          "720x720",
          "1920x1920",
          "4096x4096"
        ],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "file1542800728",
        "maxSelect": 99,
        "maxSize": 500000000,
        "mimeTypes": [],
        "name": "variants",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [
          "24x24",
          "48x48",
          "100x100",
          "200x200",
          "360x360",
          "720x720",
          "1920x1920",
          "4096x4096"
        ],
        "type": "file"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_CpaKol68gh` ON `medias` (\n  `group`,\n  `name`\n)"
    ],
    "created": "2025-05-23 12:28:50.262Z",
    "updated": "2025-06-13 12:42:11.360Z",
    "system": false
  },
  {
    "id": "sika7xbbfnwnamj",
    "listRule": "@request.auth.id != \"\" && (user = @request.auth.id || members_via_group.user ?= @request.auth.id && members_via_group.role ?>= 10)",
    "viewRule": "@request.auth.id != \"\" && (user = @request.auth.id || members_via_group.user ?= @request.auth.id && members_via_group.role ?>= 10)",
    "createRule": "@request.auth.id != \"\" && (user = @request.auth.id || members_via_group.user ?= @request.auth.id && members_via_group.role ?>= 30)",
    "updateRule": "@request.auth.id != \"\" && (user = @request.auth.id || members_via_group.user ?= @request.auth.id && members_via_group.role ?>= 30)",
    "deleteRule": "@request.auth.id != \"\" && (user = @request.auth.id || members_via_group.user ?= @request.auth.id && members_via_group.role ?>= 30)",
    "name": "groups",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "autogeneratePattern": "[a-z][a-z0-9]{4}",
        "hidden": false,
        "id": "text2324736937",
        "max": 0,
        "min": 0,
        "name": "key",
        "pattern": "^[a-z_][a-z0-9_]+$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1579384326",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select3968202353",
        "maxSelect": 0,
        "name": "plugins",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "hiboutik"
        ]
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation3479234172",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_WmY6IEY9vh` ON `groups` (`key`)"
    ],
    "created": "2025-05-23 12:28:50.265Z",
    "updated": "2025-06-13 14:09:18.596Z",
    "system": false
  },
  {
    "id": "pbc_2409499253",
    "listRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "viewRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "createRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "updateRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "deleteRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "name": "jobs",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "select1204587666",
        "maxSelect": 1,
        "name": "action",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "test",
          "hiboutik"
        ]
      },
      {
        "hidden": false,
        "id": "select2063623452",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "pending",
          "processing",
          "finished",
          "failed",
          "deleted"
        ]
      },
      {
        "hidden": false,
        "id": "number570552902",
        "max": 100,
        "min": 0,
        "name": "progress",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1574812785",
        "max": 0,
        "min": 0,
        "name": "error",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json3626513111",
        "maxSize": 0,
        "name": "input",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json325763347",
        "maxSize": 0,
        "name": "result",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json4035954268",
        "maxSize": 0,
        "name": "logs",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "file104153177",
        "maxSelect": 99,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "files",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      }
    ],
    "indexes": [],
    "created": "2025-05-23 12:28:50.267Z",
    "updated": "2025-06-16 03:58:38.286Z",
    "system": false
  },
  {
    "id": "pbc_3572739349",
    "listRule": "@request.auth.id != \"\" && (group.user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10)",
    "viewRule": "@request.auth.id != \"\" && (group.user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10)",
    "createRule": "@request.auth.id != \"\" && (group.user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 30)",
    "updateRule": "@request.auth.id != \"\" && (group.user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 30)",
    "deleteRule": "@request.auth.id != \"\" && (group.user = @request.auth.id || group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 30)",
    "name": "members",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "number1466534506",
        "max": null,
        "min": null,
        "name": "role",
        "onlyInt": true,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text196455508",
        "max": 0,
        "min": 0,
        "name": "desc",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_Avpuac2SB0` ON `members` (\n  `user`,\n  `group`\n)"
    ],
    "created": "2025-05-23 12:28:50.269Z",
    "updated": "2025-06-13 12:42:11.368Z",
    "system": false
  },
  {
    "id": "pbc_3292755704",
    "listRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "viewRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "createRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "updateRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "deleteRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "name": "categories",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1579384326",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text196455508",
        "max": 0,
        "min": 0,
        "name": "desc",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number4113142680",
        "max": null,
        "min": null,
        "name": "order",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "bool1358543748",
        "name": "enabled",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "file3309110367",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "image",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "json2918445923",
        "maxSize": 0,
        "name": "data",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "date3991540156",
        "max": "",
        "min": "",
        "name": "synchronized",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "indexes": [],
    "created": "2025-06-13 11:00:08.015Z",
    "updated": "2025-06-13 12:42:11.371Z",
    "system": false
  },
  {
    "id": "pbc_4092854851",
    "listRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "viewRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "createRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "updateRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "deleteRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "name": "products",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1579384326",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text196455508",
        "max": 0,
        "min": 0,
        "name": "desc",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number4113142680",
        "max": null,
        "min": null,
        "name": "order",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number3402113753",
        "max": null,
        "min": null,
        "name": "price",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "bool1358543748",
        "name": "enabled",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "file3309110367",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "image",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "json2918445923",
        "maxSize": 0,
        "name": "data",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3292755704",
        "hidden": false,
        "id": "relation105650625",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "category",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "date3991540156",
        "max": "",
        "min": "",
        "name": "synchronized",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "indexes": [],
    "created": "2025-06-13 11:05:35.487Z",
    "updated": "2025-06-13 12:42:11.373Z",
    "system": false
  },
  {
    "id": "pbc_3162642667",
    "listRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "viewRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "createRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "updateRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "deleteRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "name": "modifiers",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1579384326",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "bool1358543748",
        "name": "enabled",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "bool3768296713",
        "name": "required",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "number3402113753",
        "max": null,
        "min": null,
        "name": "price",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "file3309110367",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "image",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "json2918445923",
        "maxSize": 0,
        "name": "data",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "date3991540156",
        "max": "",
        "min": "",
        "name": "synchronized",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "indexes": [],
    "created": "2025-06-13 11:11:22.288Z",
    "updated": "2025-06-13 12:42:11.376Z",
    "system": false
  },
  {
    "id": "pbc_2697449135",
    "listRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "viewRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 10",
    "createRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "updateRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "deleteRule": "@request.auth.id != \"\" && group.members_via_group.user ?= @request.auth.id && group.members_via_group.role ?>= 20",
    "name": "sales",
    "type": "base",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number3257917790",
        "max": null,
        "min": null,
        "name": "total",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "date989355118",
        "max": "",
        "min": "",
        "name": "completed",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "bool3556998459",
        "name": "takeaway",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "json1325501590",
        "maxSize": 0,
        "name": "lines",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "json2918445923",
        "maxSize": 0,
        "name": "data",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "cascadeDelete": false,
        "collectionId": "sika7xbbfnwnamj",
        "hidden": false,
        "id": "relation1841317061",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "group",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "date3991540156",
        "max": "",
        "min": "",
        "name": "synchronized",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "indexes": [],
    "created": "2025-06-13 11:16:56.419Z",
    "updated": "2025-06-13 12:42:11.378Z",
    "system": false
  }
];