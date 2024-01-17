"use strict";
// Copyright Andrei <andreid.dev@gmail.com>
Object.defineProperty(exports, "__esModule", { value: true });
exports.BucketClient = void 0;
const transactions_1 = require("@mysten/sui.js/transactions");
const utils_1 = require("@mysten/sui.js/utils");
const bcs_1 = require("@mysten/bcs");
const objectTypes_1 = require("./objects/objectTypes");
const constants_1 = require("./constants");
const utils_2 = require("./utils");
const DUMMY_ADDRESS = (0, utils_1.normalizeSuiAddress)("0x0");
const packageAddress = { "mainnet": constants_1.MAINNET_PACKAGE_ID, "testnet": constants_1.TESTNET_PACKAGE_ID };
const protocolAddress = { "mainnet": constants_1.MAINNET_PROTOCOL_ID, "testnet": constants_1.TESTNET_PROTOCOL_ID };
const bucketOpAddress = { "mainnet": constants_1.MAINNET_BUCKET_OPERATIONS_PACKAGE_ID, "testnet": constants_1.TESTNET_BUCKET_OPERATIONS_PACKAGE_ID };
const contributorId = { "mainnet": constants_1.MAINNET_CONTRIBUTOR_TOKEN_ID, "testnet": constants_1.TESTNET_CONTRIBUTOR_TOKEN_ID };
const corePackageId = { "mainnet": constants_1.MAINNET_CORE_PACKAGE_ID, "testnet": constants_1.TESTNET_CORE_PACKAGE_ID };
class BucketClient {
    currentAddress;
    /**
     * @description a TS wrapper over Bucket Protocol Move packages.
     * @param client connection to fullnode
     * @param currentAddress (optional) address of the current user (default: DUMMY_ADDRESS)
     */
    client;
    packageType;
    constructor(client, options, currentAddress = DUMMY_ADDRESS) {
        this.currentAddress = currentAddress;
        this.client = client;
        this.packageType = options?.packageType ?? "mainnet";
    }
    async depositToTank(assetBuck, assetType, tankId, depositAmount) {
        /**
         * @description Deposit BUCK into tank
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id to deposit to , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param depositAmount BUCK amount to deposit into tank
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::deposit`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(depositAmount)],
        });
        return tx;
    }
    async absorbFromTank(assetBuck, assetType, tankId, collteralInput, debtAmount) {
        /**
         * @description Offset the specified debt against the BUCK contained in the Tank
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param collteralInput The collateral to add to the tank
         * @param debtAmount The amount of debt to offset
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::absorb`,
            typeArguments: [assetBuck, assetType],
            arguments: [
                tx.object(tankId),
                tx.pure(collteralInput),
                tx.pure(debtAmount),
            ],
        });
        return tx;
    }
    async withdrawFromTank(assetBuck, assetType, tankId, contributorToken) {
        /**
         * @description Withdraw BUCK and collateral gain from the Tank
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param contributorToken The contributor token
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::withdraw`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(contributorToken)],
        });
        return tx;
    }
    async claimFromTank(assetBuck, assetType, tankId, contributorToken) {
        /**
         * @description Claim collateral gain and BKT reward from the Tank
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param contributorToken The contributor token
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::claim`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(contributorToken)],
        });
        return tx;
    }
    async claimBkt(assetBuck, assetType, tankId, contributorToken) {
        /**
         * @description Claim BKT reward earned by a deposit since its last snapshots were taken
         * @param assetBuck Buck asset , e.g "0xc50de8bf1f8f9b7450646ef2d72e80ef243b6e06b22645fceed567219f3a33c4::buck::BUCK"
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param tankId The tank object id , e.g "0xcae41b2e728eace479bc0c167c3dfa03875c48c94b3b4e5dc7f33cf5cc0c43f6"
         * @param contributorToken The contributor token
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::tank::claim_bkt`,
            typeArguments: [assetBuck, assetType],
            arguments: [tx.object(tankId), tx.pure(contributorToken)],
        });
        return tx;
    }
    async borrow(assetType, protocol, collateralInput, bucketOutputAmount, insertionPlace) {
        /**
         * @description Borrow
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param collateralInput collateral input
         * @param bucketOutputAmount
         * @param insertionPlace
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::borrow`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(constants_1.ORACLE_OBJECT_ID),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                collateralInput,
                tx.pure(bucketOutputAmount, "u64"),
                tx.pure([insertionPlace]),
            ],
        });
        return tx;
    }
    async topUp(assetType, protocol, collateralInput, forAddress, insertionPlace) {
        /**
         * @description Top up function
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param collateralInput collateral input
         * @param forAddress
         * @param insertionPlace
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::top_up`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.pure(collateralInput),
                tx.pure(forAddress),
                tx.pure([insertionPlace]),
            ],
        });
        return tx;
    }
    async withdraw(assetType, protocol, oracle, collateralAmount, insertionPlace) {
        /**
         * @description withdraw
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param oracle
         * @param collateralAmount
         * @param insertionPlace
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::withdraw`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(oracle),
                tx.pure(utils_1.SUI_CLOCK_OBJECT_ID),
                tx.pure(collateralAmount),
                tx.pure([insertionPlace]),
            ],
        });
        return tx;
    }
    async repay(assetType, protocol, buckInput) {
        /**
         * @description Repay borrowed amount
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param buckInput Amount to be repaid
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::repay`,
            typeArguments: [assetType],
            arguments: [tx.object(protocol), tx.pure(buckInput)],
        });
        return tx;
    }
    async redeem(assetType, protocol, oracle, buckInput, insertionPlace) {
        /**
         * @description redeem
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param protocol Protocol id
         * @param oracle
         * @param buckInput
         * @param insertionPlace
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::buck::redeem`,
            typeArguments: [assetType],
            arguments: [
                tx.object(protocol),
                tx.object(oracle),
                tx.pure(utils_1.SUI_CLOCK_OBJECT_ID),
                tx.pure(buckInput),
                tx.pure([insertionPlace]),
            ],
        });
        return tx;
    }
    async stake(assetType, well, bktInput, lockTime) {
        /**
         * @description stake to well
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param well well object
         * @param bktInput Amount to stake
         * @param lockTime Locked time for staking
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::well::stake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(bktInput),
                tx.pure(lockTime),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID)
            ],
        });
        return tx;
    }
    async unstake(assetType, well, stakedBkt) {
        /**
         * @description unstake from well
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param well well object
         * @param stakedBkt Amount to stake
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::well::unstake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(stakedBkt),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID)
            ],
        });
        return tx;
    }
    async forceUnstake(assetType, well, bktTreasury, stakedBkt) {
        /**
         * @description forced unstake from well
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param well well object
         * @param stakedBkt Amount to stake
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::well::force_unstake`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.object(bktTreasury),
                tx.pure(stakedBkt),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID)
            ],
        });
        return tx;
    }
    async claimFromWell(assetType, well, stakedBkt) {
        /**
         * @description claim from well
         * @param assetType Asset , e.g "0x2::sui::SUI"
         * @param well well object
         * @param stakedBkt Staked BKT
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::well::claim`,
            typeArguments: [assetType],
            arguments: [
                tx.object(well),
                tx.pure(stakedBkt),
            ],
        });
        return tx;
    }
    async getAllBottles() {
        /**
         * @description Get all bottles by querying `BottleCreated` event.
         * @returns Promise<PaginatedBottleSummary> - otherwise `null` if the upstream data source is pruned.
         */
        const resp = await this.client.queryEvents({
            query: {
                MoveEventType: `${packageAddress[this.packageType]}::bucket_events::BottleCreated`,
            },
        });
        const bottles = resp.data.map((event) => {
            const rawEvent = event.parsedJson;
            return {
                bottleId: rawEvent.bottle_id,
            };
        });
        return {
            data: bottles,
            nextCursor: resp.nextCursor,
            hasNextPage: resp.hasNextPage,
        };
    }
    async getDestroyedBottles() {
        /**
         * @description Get all destroyed bottles by querying `BottleDestroyed` event.
         * @returns Promise<PaginatedBottleSummary> - otherwise `null` if the upstream data source is pruned.
         */
        const resp = await this.client.queryEvents({
            query: {
                MoveEventType: `${packageAddress[this.packageType]}::bucket_events::BottleDestroyed`,
            },
        });
        const destroyedBottles = resp.data.map((event) => {
            const rawEvent = event.parsedJson;
            return {
                bottleId: rawEvent.bottle_id,
            };
        });
        return {
            data: destroyedBottles,
            nextCursor: resp.nextCursor,
            hasNextPage: resp.hasNextPage,
        };
    }
    async encodedBucketConstants() {
        /**
         * @description Get encoded BCS Bucket values
         * @returns devInspectTransactionBlock
         */
        const tx = new transactions_1.TransactionBlock();
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::constants::fee_precision`,
        });
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::constants::liquidation_rebate`,
        });
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::constants::flash_loan_fee`,
        });
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::constants::buck_decimal`,
        });
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::constants::max_lock_time`,
        });
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::constants::min_lock_time`,
        });
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::constants::min_fee`,
        });
        tx.moveCall({
            target: `${packageAddress[this.packageType]}::constants::max_fee`,
        });
        return await this.client.devInspectTransactionBlock({
            transactionBlock: tx,
            sender: this.currentAddress,
        });
    }
    async getBucketConstants() {
        /**
       * @description Get bucket constants (decoded BCS values)
       * @returns Promise<DecodedBucketConstants | undefined>
       */
        const results = await this.encodedBucketConstants();
        if (!results) {
            return undefined;
        }
        const bcs = new bcs_1.BCS((0, bcs_1.getSuiMoveConfig)());
        let bucketObject = {};
        bucketObject = {
            ...bucketObject,
            feePrecision: bcs.de("u64", Uint8Array.from(results.results[0].returnValues[0][0])),
            liquidationRebate: bcs.de("u64", Uint8Array.from(results.results[1].returnValues[0][0])),
            flashLoanFee: bcs.de("u64", Uint8Array.from(results.results[2].returnValues[0][0])),
            buckDecimal: bcs.de("u8", Uint8Array.from(results.results[3].returnValues[0][0])),
            maxLockTime: bcs.de("u64", Uint8Array.from(results.results[4].returnValues[0][0])),
            minLockTime: bcs.de("u64", Uint8Array.from(results.results[5].returnValues[0][0])),
            minFee: bcs.de("u64", Uint8Array.from(results.results[6].returnValues[0][0])),
            maxFee: bcs.de("u64", Uint8Array.from(results.results[7].returnValues[0][0])),
        };
        return bucketObject;
    }
    async getAllBuckets() {
        /**
       * @description Get all buckets
       */
        let buckets = [];
        try {
            const generalInfo = await this.client.getObject({
                id: protocolAddress[this.packageType],
                options: {
                    showContent: true,
                }
            });
            const generalInfoField = generalInfo.data?.content;
            const minBottleSize = generalInfoField.fields.min_bottle_size;
            const protocolFields = await this.client.getDynamicFields({
                parentId: protocolAddress[this.packageType],
            });
            const bucketList = protocolFields.data.filter((item) => item.objectType.includes("Bucket"));
            const objectIdList = bucketList.map((item) => item.objectId);
            const response = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            response.map((res, index) => {
                const typeId = res.data?.type?.split("<").pop()?.replace(">", "") ?? "";
                const token = Object.keys(constants_1.COINS_TYPE_LIST).find(key => constants_1.COINS_TYPE_LIST[key] === typeId);
                if (!token) {
                    return;
                }
                const fields = (0, objectTypes_1.getObjectFields)(res);
                const bucketInfo = {
                    token: token,
                    baseFeeRate: Number(fields.base_fee_rate ?? 5_000),
                    bottleTableSize: fields.bottle_table.fields.table.fields.size ?? "",
                    collateralDecimal: fields.collateral_decimal ?? 0,
                    collateralVault: fields.collateral_vault ?? "",
                    latestRedemptionTime: Number(fields.latest_redemption_time ?? 0),
                    minCollateralRatio: fields.min_collateral_ratio ?? "",
                    mintedBuckAmount: fields.minted_buck_amount ?? "",
                    minBottleSize: minBottleSize,
                    maxMintAmount: fields.max_mint_amount ?? "",
                    recoveryModeThreshold: fields.recovery_mode_threshold ?? "",
                };
                buckets.push(bucketInfo);
            });
        }
        catch (error) {
            console.log(error);
        }
        return buckets;
    }
    ;
    async getAllTanks() {
        /**
       * @description Get all tanks objects
       */
        try {
            const protocolFields = await this.client.getDynamicFields({
                parentId: protocolAddress[this.packageType]
            });
            const tankList = protocolFields.data.filter((item) => item.objectType.includes("Tank"));
            const objectIdList = tankList.map((item) => item.objectId);
            const response = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            const tankInfoList = [];
            response.forEach((res, index) => {
                const fields = (0, objectTypes_1.getObjectFields)(res);
                let token = "";
                const objectType = res.data?.type;
                if (objectType) {
                    const assetType = objectType.split(",")[1].trim().split(">")[0].trim();
                    token = Object.keys(constants_1.COINS_TYPE_LIST).find(symbol => constants_1.COINS_TYPE_LIST[symbol] == assetType) ?? "";
                }
                const tankInfo = {
                    token,
                    buckReserve: fields?.reserve || "0",
                    collateralPool: fields?.collateral_pool || "0",
                    currentS: fields?.current_s || "0",
                    currentP: fields?.current_p || "1",
                };
                tankInfoList.push(tankInfo);
            });
            return tankInfoList;
        }
        catch (error) {
            return [];
        }
    }
    ;
    async getUserBottles(address) {
        /**
         * @description Get positions array for input address
         * @address User address that belong to bottle
         * @returns Promise<BottleInfo>
         */
        if (!address)
            return [];
        try {
            const protocolFields = await this.client.getDynamicFields({
                parentId: protocolAddress[this.packageType]
            });
            const bucketList = protocolFields.data.filter((item) => item.objectType.includes("Bucket"));
            const objectTypeList = bucketList.map((item) => item.objectType);
            const objectIdList = bucketList.map((item) => item.objectId);
            const objectNameList = (0, utils_2.getObjectNames)(objectTypeList);
            const response = await this.client.multiGetObjects({
                ids: objectIdList,
                options: {
                    showContent: true,
                    showType: true, //Check could we get type from response later
                },
            });
            const bottleIdList = [];
            response.map((res, index) => {
                //Filter out WBTC and WETH
                //When we launch WBTC and WETH, we need to remove this exception
                if (objectNameList[index] === "WBTC" || objectNameList[index] === "WETH")
                    return;
                const bucketFields = (0, objectTypes_1.getObjectFields)(res);
                bottleIdList.push({
                    name: objectNameList[index] ?? "",
                    id: bucketFields.bottle_table.fields.table.fields.id.id,
                });
            });
            const userBottles = [];
            for (const bottle of bottleIdList) {
                await this.client
                    .getDynamicFieldObject({
                    parentId: bottle.id ?? "",
                    name: {
                        type: "address",
                        value: address,
                    },
                })
                    .then((bottleInfo) => {
                    const bottleInfoFields = (0, objectTypes_1.getObjectFields)(bottleInfo);
                    if (bottleInfoFields) {
                        userBottles.push({
                            token: bottle.name ?? "",
                            collateralAmount: bottleInfoFields.value.fields.value.fields.collateral_amount,
                            buckAmount: bottleInfoFields.value.fields.value.fields.buck_amount,
                        });
                    }
                })
                    .catch((error) => {
                    console.log("error", error);
                });
            }
            return userBottles;
        }
        catch (error) {
            return [];
        }
    }
    ;
    async getUserTanks(address) {
        /**
         * @description Get tanks array for input address
         * @address User address that belong to bottle
         * @returns Promise<TankInfo>
         */
        if (!address)
            return {};
        const CONTRIBUTOR_TOKEN_ID = contributorId[this.packageType];
        let userTanks = {};
        try {
            // Get all tank objects
            const protocolFields = await this.client.getDynamicFields({
                parentId: protocolAddress[this.packageType]
            });
            const tankList = protocolFields.data.filter((item) => item.objectType.includes("Tank"));
            // Split coin type from result
            const tankTypes = tankList.map(tank => {
                const tankType = tank.objectType;
                const splitTypeString = tankType.split("<").pop();
                if (!splitTypeString)
                    return;
                const coinType = splitTypeString.replace(">", "").split(",").pop();
                if (!coinType)
                    return;
                return coinType.trim();
            });
            // Build contributor token filter
            const filters = tankTypes.map(tankType => {
                return {
                    StructType: `${CONTRIBUTOR_TOKEN_ID}::tank::ContributorToken<${CONTRIBUTOR_TOKEN_ID}::buck::BUCK, ${tankType}>`
                };
            });
            // Get contributor token accounts for user address
            const { data: contributorTokens } = await this.client.getOwnedObjects({
                owner: address,
                filter: {
                    MatchAny: filters
                },
                options: {
                    showContent: true,
                }
            });
            for (const tankType of tankTypes) {
                if (!tankType) {
                    continue;
                }
                // Filter contributor tokens by selected tank
                const tokens = contributorTokens.filter(x => {
                    if (x.data?.content?.dataType == 'moveObject') {
                        const typeId = x.data.content.type;
                        return typeId.endsWith(tankType + ">");
                    }
                    return false;
                });
                const token = Object.keys(constants_1.COINS_TYPE_LIST).filter(x => constants_1.COINS_TYPE_LIST[x] == tankType)[0];
                const totalBUCK = await this.getUserTankBUCK(tankType, tokens);
                const totalEarned = await this.getUserTankEarn(tankType, tokens);
                userTanks[token] = {
                    totalBUCK,
                    totalEarned,
                };
            }
        }
        catch (error) {
        }
        return userTanks;
    }
    ;
    async getUserTankBUCK(tankType, tokens) {
        if (tokens.length == 0) {
            return 0;
        }
        const tx = new transactions_1.TransactionBlock();
        const CORE_PACKAGE_ID = corePackageId[this.packageType];
        const PROTOCOL_ID = protocolAddress[this.packageType];
        const tank = tx.moveCall({
            target: `${CORE_PACKAGE_ID}::buck::borrow_tank`,
            typeArguments: [tankType],
            arguments: [tx.object(PROTOCOL_ID)],
        });
        const target = `${CORE_PACKAGE_ID}::tank::get_token_weight`;
        for (const token of tokens) {
            if (!token.data) {
                continue;
            }
            tx.moveCall({
                target: target,
                typeArguments: [constants_1.COINS_TYPE_LIST.BUCK, tankType],
                arguments: [tank, tx.objectRef({
                        objectId: token.data.objectId,
                        digest: token.data.digest,
                        version: token.data.version,
                    })],
            });
        }
        const res = await this.client.devInspectTransactionBlock({
            transactionBlock: tx,
            sender: PROTOCOL_ID,
        });
        const resultArray = res?.results?.slice(1);
        if (resultArray?.length === 0)
            return 0;
        const bytesArray = resultArray?.map((result) => {
            if (result?.returnValues === undefined)
                return [0];
            if (result?.returnValues[0] === undefined)
                return [0];
            return result?.returnValues[0][0];
        });
        if (!bytesArray)
            return 0;
        let total = 0;
        bytesArray.forEach((bytes) => {
            const u64 = (0, utils_2.U64FromBytes)(bytes);
            total += Number((0, utils_2.formatUnits)(u64, 9)); //BUCK decimals
        });
        return total;
    }
    async getUserTankEarn(tankType, tokens) {
        if (tokens.length == 0) {
            return 0;
        }
        const coinSymbol = Object.keys(constants_1.COINS_TYPE_LIST).filter(x => constants_1.COINS_TYPE_LIST[x] == tankType)[0];
        const tx = new transactions_1.TransactionBlock();
        const CORE_PACKAGE_ID = corePackageId[this.packageType];
        const PROTOCOL_ID = protocolAddress[this.packageType];
        const tank = tx.moveCall({
            target: `${CORE_PACKAGE_ID}::buck::borrow_tank`,
            typeArguments: [tankType],
            arguments: [tx.object(PROTOCOL_ID)],
        });
        const target = `${CORE_PACKAGE_ID}::tank::get_collateral_reward_amount`;
        for (const token of tokens) {
            if (!token.data) {
                continue;
            }
            tx.moveCall({
                target: target,
                typeArguments: [constants_1.COINS_TYPE_LIST.BUCK, tankType],
                arguments: [tank, tx.objectRef({
                        objectId: token.data.objectId,
                        digest: token.data.digest,
                        version: token.data.version,
                    })],
            });
        }
        const res = await this.client.devInspectTransactionBlock({
            transactionBlock: tx,
            sender: PROTOCOL_ID,
        });
        const resultArray = res?.results?.slice(1);
        if (resultArray?.length === 0)
            return 0;
        const bytesArray = resultArray?.map((result) => {
            if (result?.returnValues === undefined)
                return [0];
            if (result?.returnValues[0] === undefined)
                return [0];
            return result?.returnValues[0][0];
        });
        if (!bytesArray)
            return 0;
        let total = 0;
        bytesArray.forEach((bytes) => {
            const u64 = (0, utils_2.U64FromBytes)(bytes);
            total += Number((0, utils_2.formatUnits)(u64, constants_1.COIN_DECIMALS[coinSymbol] ?? 9));
        });
        return total;
    }
    async getPrices() {
        /**
         * @description Get all prices
        */
        const ids = Object.values(constants_1.SUPRA_PRICE_FEEDS);
        const objectNameList = Object.keys(constants_1.SUPRA_PRICE_FEEDS);
        const priceObjects = await this.client.multiGetObjects({
            ids,
            options: {
                showContent: true,
                showType: true, //Check could we get type from response later
            },
        });
        const prices = {
            WETH: 0,
            SUI: 0,
            vSUI: 0,
            afSUI: 0,
            haSUI: 0,
            USDC: 1,
            USDT: 1,
            BUCK: 1,
        };
        priceObjects.map((res, index) => {
            const priceFeed = (0, objectTypes_1.getObjectFields)(res);
            const priceBn = priceFeed.value.fields.value;
            const decimals = priceFeed.value.fields.decimal;
            const price = parseInt(priceBn) / Math.pow(10, decimals);
            if (objectNameList[index] == 'usdc_usd') {
                prices['USDC'] = price;
            }
            else if (objectNameList[index] == 'usdt_usd') {
                prices['USDT'] = price;
            }
            else if (objectNameList[index] == 'eth_usdt') {
                prices['WETH'] = prices['USDT'] * price;
            }
            else if (objectNameList[index] == 'sui_usdt') {
                prices['SUI'] = prices['USDT'] * price;
            }
            else if (objectNameList[index] == 'vsui_sui') {
                prices['vSUI'] = prices['SUI'] * price;
            }
            else if (objectNameList[index] == 'hasui_sui') {
                prices['haSUI'] = prices['SUI'] * price;
            }
            else if (objectNameList[index] == 'afsui_sui') {
                prices['afSUI'] = prices['SUI'] * price;
            }
        });
        return prices;
    }
    async getAPYs() {
        /**
         * @description Get APYs for vSUI, afSUI, haSUI
        */
        let apys = {
            vSUI: 4.2 // Use constant value
        };
        // Get haSUI APY
        try {
            const response = await (await fetch(constants_1.HASUI_APY_URL)).json();
            apys["haSUI"] = response.data.apy;
        }
        catch (error) {
            // console.log(error);
        }
        // Get afSUI APY
        try {
            const apy = await (await fetch(constants_1.AFSUI_APY_URL)).text();
            apys["afSUI"] = parseFloat(apy) * 100;
        }
        catch (error) {
            // console.log(error);
        }
        return apys;
    }
    async getBorrowTx(isNewBottle, collateralType, collateralAmount, borrowAmount, walletAddress) {
        /**
         * @description Borrow
         * @param isNewBottle
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param collateralAmount
         * @param borrowAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        const { data: coins } = await this.client.getCoins({
            owner: walletAddress,
            coinType: collateralType,
        });
        const protocolId = protocolAddress[this.packageType];
        const packageId = bucketOpAddress[this.packageType];
        let coinSymbol = Object.keys(constants_1.COINS_TYPE_LIST).filter(symbol => constants_1.COINS_TYPE_LIST[symbol] == collateralType)[0];
        let collateralCoinInput = undefined;
        if (collateralType === constants_1.COINS_TYPE_LIST.SUI) {
            collateralCoinInput = tx.splitCoins(tx.gas, [
                tx.pure(collateralAmount, "u64"),
            ]);
        }
        else {
            const [mainCoin, ...otherCoins] = coins
                .filter((coin) => coin.coinType === collateralType)
                .map((coin) => tx.objectRef({
                objectId: coin.coinObjectId,
                digest: coin.digest,
                version: coin.version,
            }));
            if (mainCoin) {
                if (otherCoins.length > 0) {
                    tx.mergeCoins(mainCoin, otherCoins);
                    collateralCoinInput = tx.splitCoins(mainCoin, [
                        tx.pure(collateralAmount, "u64"),
                    ]);
                }
                else {
                    collateralCoinInput = tx.splitCoins(mainCoin, [
                        tx.pure(collateralAmount, "u64"),
                    ]);
                }
            }
        }
        if (!collateralCoinInput)
            return tx;
        if (borrowAmount == 0) {
            tx.moveCall({
                target: `${packageId}::bucket_operations::top_up`,
                typeArguments: [collateralType],
                arguments: [
                    tx.object(protocolId),
                    collateralCoinInput,
                    tx.pure(walletAddress, "address"),
                    isNewBottle ?
                        tx.pure([]) :
                        tx.pure([walletAddress]),
                ],
            });
        }
        else {
            tx.moveCall({
                target: constants_1.SUPRA_UPDATE_TARGET,
                typeArguments: [collateralType],
                arguments: [
                    tx.object(constants_1.ORACLE_OBJECT_ID),
                    tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                    tx.object(constants_1.SUPRA_HANDLER_OBJECT),
                    tx.pure(constants_1.SUPRA_ID[coinSymbol] ?? "", "u32"),
                ],
            });
            tx.moveCall({
                target: `${packageId}::bucket_operations::borrow`,
                typeArguments: [collateralType],
                arguments: [
                    tx.object(protocolId),
                    tx.object(constants_1.ORACLE_OBJECT_ID),
                    tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                    collateralCoinInput,
                    tx.pure(borrowAmount, "u64"),
                    isNewBottle ?
                        tx.pure([]) :
                        tx.pure([walletAddress]),
                ],
            });
        }
        ;
        return tx;
    }
    async getRepayTx(collateralType, repayAmount, withdrawAmount, walletAddress) {
        /**
         * @description Repay
         * @param collateralType Asset , e.g "0x2::sui::SUI"
         * @param repayAmount
         * @param withdrawAmount
         * @param walletAddress
         * @returns Promise<TransactionBlock>
         */
        const tx = new transactions_1.TransactionBlock();
        const { data: coins } = await this.client.getCoins({
            owner: walletAddress,
            coinType: constants_1.COINS_TYPE_LIST.BUCK,
        });
        const protocolId = protocolAddress[this.packageType];
        const packageId = bucketOpAddress[this.packageType];
        let buckCoinInput = undefined;
        const [mainCoin, ...otherCoins] = coins
            .filter((coin) => coin.coinType === constants_1.COINS_TYPE_LIST.BUCK)
            .map((coin) => tx.objectRef({
            objectId: coin.coinObjectId,
            digest: coin.digest,
            version: coin.version,
        }));
        if (mainCoin) {
            if (otherCoins.length !== 0)
                tx.mergeCoins(mainCoin, otherCoins);
            buckCoinInput = tx.splitCoins(mainCoin, [
                tx.pure(repayAmount, "u64"),
            ]);
        }
        if (!buckCoinInput)
            return tx;
        let coinSymbol = Object.keys(constants_1.COINS_TYPE_LIST).filter(symbol => constants_1.COINS_TYPE_LIST[symbol] == collateralType)[0];
        tx.moveCall({
            target: constants_1.SUPRA_UPDATE_TARGET,
            typeArguments: [collateralType],
            arguments: [
                tx.object(constants_1.ORACLE_OBJECT_ID),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                tx.object(constants_1.SUPRA_HANDLER_OBJECT),
                tx.pure(constants_1.SUPRA_ID[coinSymbol] ?? "", "u32"),
            ],
        });
        tx.moveCall({
            target: `${packageId}::bucket_operations::repay_and_withdraw`,
            typeArguments: [collateralType],
            arguments: [
                tx.object(protocolId),
                tx.object(constants_1.ORACLE_OBJECT_ID),
                tx.object(utils_1.SUI_CLOCK_OBJECT_ID),
                buckCoinInput,
                tx.pure(withdrawAmount, "u64"),
                tx.pure([walletAddress]),
            ],
        });
        return tx;
    }
}
exports.BucketClient = BucketClient;
//# sourceMappingURL=client.js.map