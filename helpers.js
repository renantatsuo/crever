export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const parseArgs = (args, argv) => {
  return args.reduce((acc, curr) => {
    const [value, err] = getArgValue(curr, argv);

    if (err) {
      throw new Error(`Invalid argument ${curr.name}: ${value}`);
    }

    if (value) {
      return {
        ...acc,
        [curr.name]: value,
      };
    }

    return acc;
  }, {});
};

function getArgValue(arg, argv) {
  const id = (() =>
    arg.options.map((o) => argv.indexOf(o)).find((v) => v !== -1))();

  if (id === undefined && arg.required) {
    return [null, true];
  }

  if (id === undefined) {
    return [null, false];
  }

  const val = argv[id + 1];

  if (!val && arg.required) {
    return [null, true];
  }

  return [val, false];
}
