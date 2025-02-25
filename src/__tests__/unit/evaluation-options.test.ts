import { EvaluationOptionsEvaluator } from '../../contract/EvaluationOptionsEvaluator';
import { WarpFactory } from '../../core/WarpFactory';

describe('Evaluation options evaluator', () => {
  const warp = WarpFactory.forLocal();

  it('should properly set root evaluation options', async () => {
    const contract = warp.contract(null);

    expect(new EvaluationOptionsEvaluator(contract.evaluationOptions(), {}).rootOptions).toEqual({
      allowBigInt: false,
      cacheEveryNInteractions: -1,
      gasLimit: 9007199254740991,
      ignoreExceptions: true,
      internalWrites: false,
      maxCallDepth: 7,
      maxInteractionEvaluationTimeSeconds: 60,
      mineArLocalBlocks: true,
      sequencerUrl: 'https://d1o5nlqr4okus2.cloudfront.net/',
      stackTrace: {
        saveState: false
      },
      throwOnInternalWriteError: true,
      unsafeClient: 'throw',
      updateCacheForEachInteraction: false,
      useVM2: false,
      waitForConfirmation: false,
      walletBalanceUrl: 'http://nyc-1.dev.arweave.net:1984/'
    });

    contract.setEvaluationOptions({
      allowBigInt: true,
      useVM2: true,
      internalWrites: true,
      gasLimit: 3453453
    });

    expect(
      new EvaluationOptionsEvaluator(contract.evaluationOptions(), {
        allowBigInt: true,
        useVM2: true,
        internalWrites: true,
        gasLimit: 3453453
      }).rootOptions
    ).toEqual({
      allowBigInt: true,
      cacheEveryNInteractions: -1,
      gasLimit: 3453453,
      ignoreExceptions: true,
      internalWrites: true,
      maxCallDepth: 7,
      maxInteractionEvaluationTimeSeconds: 60,
      mineArLocalBlocks: true,
      sequencerUrl: 'https://d1o5nlqr4okus2.cloudfront.net/',
      stackTrace: {
        saveState: false
      },
      throwOnInternalWriteError: true,
      unsafeClient: 'throw',
      updateCacheForEachInteraction: false,
      useVM2: true,
      waitForConfirmation: false,
      walletBalanceUrl: 'http://nyc-1.dev.arweave.net:1984/'
    });

    const contract2 = warp.contract(null).setEvaluationOptions({
      internalWrites: true,
      useVM2: true,
      unsafeClient: 'allow',
      gasLimit: 2222,
      maxCallDepth: 5
    });

    expect(new EvaluationOptionsEvaluator(contract2.evaluationOptions(), {}).rootOptions).toEqual({
      allowBigInt: false,
      cacheEveryNInteractions: -1,
      gasLimit: 2222,
      ignoreExceptions: true,
      internalWrites: true,
      maxCallDepth: 5,
      maxInteractionEvaluationTimeSeconds: 60,
      mineArLocalBlocks: true,
      sequencerUrl: 'https://d1o5nlqr4okus2.cloudfront.net/',
      stackTrace: {
        saveState: false
      },
      throwOnInternalWriteError: true,
      unsafeClient: 'allow',
      updateCacheForEachInteraction: false,
      useVM2: true,
      waitForConfirmation: false,
      walletBalanceUrl: 'http://nyc-1.dev.arweave.net:1984/'
    });

    expect(function () {
      const result = new EvaluationOptionsEvaluator(contract2.evaluationOptions(), {
        useVM2: false
      }).rootOptions;
    }).toThrow(
      'Option {useVM2} differs. EvaluationOptions: [true], manifest: [false]. Use contract.setEvaluationOptions({useVM2: false) to evaluate contract state.'
    );
  });

  it('should properly set foreign evaluation options - unsafeClient - allow', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      unsafeClient: 'allow'
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ unsafeClient: 'allow' })['unsafeClient']).toEqual('allow');
    expect(eoEvaluator.forForeignContract({ unsafeClient: 'skip' })['unsafeClient']).toEqual('skip');
    expect(eoEvaluator.forForeignContract({ unsafeClient: 'throw' })['unsafeClient']).toEqual('skip');
  });

  it('should properly set foreign evaluation options - unsafeClient - skip', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      unsafeClient: 'skip'
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ unsafeClient: 'allow' })['unsafeClient']).toEqual('skip');
    expect(eoEvaluator.forForeignContract({ unsafeClient: 'skip' })['unsafeClient']).toEqual('skip');
    expect(eoEvaluator.forForeignContract({ unsafeClient: 'throw' })['unsafeClient']).toEqual('skip');
  });

  it('should properly set foreign evaluation options - unsafeClient - throw', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      unsafeClient: 'throw'
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ unsafeClient: 'allow' })['unsafeClient']).toEqual('throw');
    expect(eoEvaluator.forForeignContract({ unsafeClient: 'skip' })['unsafeClient']).toEqual('throw');
    expect(eoEvaluator.forForeignContract({ unsafeClient: 'throw' })['unsafeClient']).toEqual('throw');
  });

  it('should properly set foreign evaluation options - internalWrites - true', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      internalWrites: true
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ internalWrites: true })['internalWrites']).toEqual(true);
    expect(eoEvaluator.forForeignContract({ internalWrites: false })['internalWrites']).toEqual(false);
  });

  it('should properly set foreign evaluation options - internalWrites - false', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      internalWrites: false
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ internalWrites: true })['internalWrites']).toEqual(true);
    expect(eoEvaluator.forForeignContract({ internalWrites: false })['internalWrites']).toEqual(false);
  });

  it('should properly set foreign evaluation options - throwOnInternalWriteError - true', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      throwOnInternalWriteError: true
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ throwOnInternalWriteError: true })['throwOnInternalWriteError']).toEqual(
      true
    );
    expect(eoEvaluator.forForeignContract({ throwOnInternalWriteError: false })['throwOnInternalWriteError']).toEqual(
      false
    );
  });

  it('should properly set foreign evaluation options - throwOnInternalWriteError - false', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      throwOnInternalWriteError: false
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ throwOnInternalWriteError: true })['throwOnInternalWriteError']).toEqual(
      true
    );
    expect(eoEvaluator.forForeignContract({ throwOnInternalWriteError: false })['throwOnInternalWriteError']).toEqual(
      false
    );
  });

  it('should properly set foreign evaluation options - ignoreExceptions - true', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      ignoreExceptions: true
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ ignoreExceptions: true })['ignoreExceptions']).toEqual(true);
    expect(eoEvaluator.forForeignContract({ ignoreExceptions: false })['ignoreExceptions']).toEqual(true);
  });

  it('should properly set foreign evaluation options - ignoreExceptions - false', async () => {
    const contract = warp.contract(null).setEvaluationOptions({
      ignoreExceptions: false
    });
    const eoEvaluator = new EvaluationOptionsEvaluator(contract.evaluationOptions(), {});

    expect(eoEvaluator.forForeignContract({ ignoreExceptions: true })['ignoreExceptions']).toEqual(false);
    expect(eoEvaluator.forForeignContract({ ignoreExceptions: false })['ignoreExceptions']).toEqual(false);
  });
});
