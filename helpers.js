export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const parseArgs = (argOptions, processArgs) => {
  return argOptions.reduce((argMap, currArg) => {
    const [value, err] = getArgValue(currArg, processArgs);

    if (err) {
      throw new Error(`Invalid argument ${currArg.name}: ${value}`);
    }

    if (value) {
      return {
        ...argMap,
        [currArg.name]: value,
      };
    }

    return argMap;
  }, {});
};

const getArgValue = (arg, argv) => {
  if (arg.env) {
    console.info(`Loading [${arg.name}] from ENV.`);
    return [arg.env, false];
  }

  const argIndex = (() =>
    arg.options.map((o) => argv.indexOf(o)).find((v) => v !== -1))();

  if (argIndex === undefined && arg.required) {
    return [null, true];
  }

  if (argIndex === undefined && !arg.required) {
    return [arg.default, false];
  }

  const val = argv[argIndex + 1];

  if (!val && arg.required) {
    return [null, true];
  }

  return [val, false];
};

export const compareArrays = (left, right) =>
  JSON.stringify(left) === JSON.stringify(right);
