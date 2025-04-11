const http = require('node:http');
const { convertToCase } = require('./convertToCase/convertToCase');

const createServer = () => {
  return http.createServer((req, res) => {
    const normalizedUrl = new URL(req.url, 'http://localhost:5700');
    const availableCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];
    const text = normalizedUrl.pathname.slice(1);
    const toCase = normalizedUrl.searchParams.get('toCase');
    const errors = [];
    const errorObj = {
      noText:
        'Text to convert is required. ' +
        'Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      noToCase:
        '"toCase" query param is required. ' +
        'Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      wrongCase:
        'This case is not supported. ' +
        'Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
    };

    res.setHeader('Content-Type', 'application/json');

    if (!text) {
      res.statusCode = 400;

      errors.push({ message: errorObj.noText });
    }

    if (!toCase) {
      res.statusCode = 400;

      errors.push({ message: errorObj.noToCase });
    }

    if (
      !availableCases.includes(toCase) &&
      !errors.find((obj) => obj.message === errorObj.noToCase)
    ) {
      res.statusCode = 400;

      errors.push({ message: errorObj.wrongCase });
    }

    if (res.statusCode === 400) {
      res.end(JSON.stringify({ errors }));
    } else {
      const convertedCase = convertToCase(text, toCase);

      res.statusCode = 200;

      res.end(
        JSON.stringify({
          originalCase: convertedCase.originalCase,
          targetCase: toCase,
          originalText: text,
          convertedText: convertedCase.convertedText,
        }),
      );
    }
  });
};

module.exports = { createServer };
