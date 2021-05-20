import bodyParser from "body-parser";
import Express from "express";
import Http from "http";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Question, QuestionDescriptor } from "./db/entities/Question";

const HTTP_PORT = process.env.PORT ?? 5000;
const HTTP_DEMO_ROOT = "./demo";

let app = Express();

createConnection()
  .then((connection) => {
    // fix postgres timezone parsing
    const driver = connection.driver as any;
    driver.postgres.defaults.parseInputDatesAsUTC = true;
    driver.postgres.types.setTypeParser(
      1114,
      (str: any) => new Date(str + "Z")
    );

    app.all("*", (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "https://thanaverage.xyz/");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "PUT,POST,GET,DELETE,OPTIONS,HEAD"
      );
      res.header("Access-Control-Allow-Credentials", "true");
      req.method === "OPTIONS" ? res.sendStatus(200) : next();
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const questionRepository = connection.getRepository(Question);

    questionDescriptors.forEach((questionDescriptor) => {
      const question = Question.construct(questionDescriptor);
      // Saves if does not exist
      questionRepository.save(question);
    });

    backupResponses.forEach(
      ({ questionNumber, votesPositive, votesNegative }) => {
        questionRepository
          .findOne(questionNumber)
          .then((question) => {
            if (question.votesNegative < votesNegative) {
              question.votesNegative = votesNegative;
            }

            if (question.votesPositive < votesPositive) {
              question.votesPositive = votesPositive;
            }

            questionRepository.save(question);
          })
          .catch(() => {
            console.log(
              `Could not find question with is ${questionNumber} to update backup results`
            );
          });
      }
    );

    app.get("/questions", async (req, res) => {
      const questions = (await questionRepository.find()).map(
        ({
          questionNumber,
          questionText,
          positiveAnswer,
          negativeAnswer,
          positiveFormulation,
          negativeFormulation,
          votesPositive,
          votesNegative,
        }) => [
          questionNumber,
          questionText,
          positiveAnswer,
          negativeAnswer,
          positiveFormulation,
          negativeFormulation,
          votesPositive + votesNegative,
          votesPositive,
          votesNegative,
        ]
      );
      res.json(questions);
    });

    app.post("/answer", async (req, res) => {
      const answer = req.body as {
        questionNumber: number;
        answer: "yes" | "no";
      };

      questionRepository
        .findOne(answer.questionNumber)
        .then((question) => {
          if (answer.answer === "yes") {
            question.votesPositive += 1;
          } else if (answer.answer === "no") {
            question.votesNegative += 1;
          }

          questionRepository.save(question);
          res.send(`Updated answer ${JSON.stringify(req.body)}`);
        })
        .catch(() => {
          res.send(`Did not update answer. Question didn't exist`);
        });
    });

    if (process.env.DEMO === "true") {
      app.use(Express.static(HTTP_DEMO_ROOT));
    }

    const httpServer = Http.createServer(app);

    httpServer.listen(HTTP_PORT, () => {
      console.log(`Http server started on port: ${HTTP_PORT}`);
    });

    httpServer.on("error", (e: any) => {
      console.error(e);
    });

    httpServer.on("close", () => {
      console.log("Http server closed.");
    });
  })
  .catch(console.error);

const backupResponses = [
  { questionNumber: 1, votesPositive: 2658, votesNegative: 1039 },
  { questionNumber: 2, votesPositive: 2369, votesNegative: 2786 },
  { questionNumber: 3, votesPositive: 3452, votesNegative: 1813 },
  { questionNumber: 4, votesPositive: 1874, votesNegative: 3255 },
  { questionNumber: 5, votesPositive: 4490, votesNegative: 767 },
  { questionNumber: 6, votesPositive: 2256, votesNegative: 2829 },
  { questionNumber: 7, votesPositive: 3244, votesNegative: 1970 },
  { questionNumber: 8, votesPositive: 4374, votesNegative: 823 },
  { questionNumber: 9, votesPositive: 2705, votesNegative: 2470 },
  { questionNumber: 10, votesPositive: 2746, votesNegative: 2545 },
  { questionNumber: 11, votesPositive: 2497, votesNegative: 2658 },
  { questionNumber: 12, votesPositive: 4503, votesNegative: 883 },
  { questionNumber: 13, votesPositive: 2582, votesNegative: 2627 },
  { questionNumber: 14, votesPositive: 3703, votesNegative: 1507 },
  { questionNumber: 15, votesPositive: 3481, votesNegative: 1727 },
  { questionNumber: 16, votesPositive: 963, votesNegative: 4371 },
  { questionNumber: 17, votesPositive: 2247, votesNegative: 3105 },
  { questionNumber: 18, votesPositive: 783, votesNegative: 4142 },
  { questionNumber: 19, votesPositive: 3124, votesNegative: 3124 },
  { questionNumber: 20, votesPositive: 1906, votesNegative: 3122 },
  { questionNumber: 21, votesPositive: 2481, votesNegative: 2824 },
  { questionNumber: 22, votesPositive: 3937, votesNegative: 1083 },
  { questionNumber: 23, votesPositive: 2659, votesNegative: 2688 },
  { questionNumber: 24, votesPositive: 2314, votesNegative: 2666 },
  { questionNumber: 25, votesPositive: 3302, votesNegative: 1726 },
  { questionNumber: 26, votesPositive: 2201, votesNegative: 3043 },
  { questionNumber: 27, votesPositive: 2658, votesNegative: 2631 },
  { questionNumber: 28, votesPositive: 1350, votesNegative: 1990 },
  { questionNumber: 29, votesPositive: 3133, votesNegative: 1913 },
  { questionNumber: 30, votesPositive: 1968, votesNegative: 2733 },
  { questionNumber: 31, votesPositive: 3476, votesNegative: 1082 },
  { questionNumber: 32, votesPositive: 2947, votesNegative: 1647 },
  { questionNumber: 33, votesPositive: 3190, votesNegative: 1249 },
  { questionNumber: 34, votesPositive: 2234, votesNegative: 2133 },
  { questionNumber: 35, votesPositive: 2736, votesNegative: 1646 },
  { questionNumber: 36, votesPositive: 2997, votesNegative: 1581 },
  { questionNumber: 37, votesPositive: 2451, votesNegative: 2100 },
  { questionNumber: 38, votesPositive: 1644, votesNegative: 3101 },
  { questionNumber: 39, votesPositive: 1410, votesNegative: 3324 },
  { questionNumber: 40, votesPositive: 2120, votesNegative: 2539 },
  { questionNumber: 41, votesPositive: 2556, votesNegative: 1927 },
  { questionNumber: 42, votesPositive: 2204, votesNegative: 2018 },
  { questionNumber: 43, votesPositive: 961, votesNegative: 3530 },
  { questionNumber: 44, votesPositive: 3633, votesNegative: 772 },
  { questionNumber: 45, votesPositive: 1926, votesNegative: 2655 },
  { questionNumber: 46, votesPositive: 1556, votesNegative: 2960 },
  { questionNumber: 47, votesPositive: 1749, votesNegative: 2593 },
  { questionNumber: 48, votesPositive: 1966, votesNegative: 2486 },
  { questionNumber: 49, votesPositive: 920, votesNegative: 3432 },
  { questionNumber: 50, votesPositive: 2347, votesNegative: 2007 },
  { questionNumber: 51, votesPositive: 390, votesNegative: 3957 },
  { questionNumber: 52, votesPositive: 1373, votesNegative: 1384 },
];

const questionDescriptors: QuestionDescriptor[] = [
  {
    questionNumber: 1,
    questionText: "Do you walk faster",
    positiveAnswer: "I'm faster",
    negativeAnswer: "I'm slower",
    positiveFormulation: "walk faster",
    negativeFormulation: "walk slower",
  },
  {
    questionNumber: 2,
    questionText: "Do you eat healthier food",
    positiveAnswer: "healthier",
    negativeAnswer: "less healthy",
    positiveFormulation: "eat healthier",
    negativeFormulation: "eat less healthy",
  },
  {
    questionNumber: 3,
    questionText: "Do you care more about the environment",
    positiveAnswer: "I care more",
    negativeAnswer: "I care less",
    positiveFormulation: "care more about the environment",
    negativeFormulation: "care less about the environment",
  },
  {
    questionNumber: 4,
    questionText: "Are you better at keeping your home tidy",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are better at keeping their home tidy",
    negativeFormulation: "are worse at keeping their home tidy",
  },
  {
    questionNumber: 5,
    questionText: "Are you smarter",
    positiveAnswer: "I'm smarter",
    negativeAnswer: "I'm less smart ",
    positiveFormulation: "are smarter",
    negativeFormulation: "are less smart",
  },
  {
    questionNumber: 6,
    questionText: "Are your feet looking better",
    positiveAnswer: "they're better",
    negativeAnswer: "they're worse",
    positiveFormulation: "have better looking feet",
    negativeFormulation: "have worse looking feet",
  },
  {
    questionNumber: 7,
    questionText: "Are you a better listener",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are a better listener",
    negativeFormulation: "are a worse listener",
  },
  {
    questionNumber: 8,
    questionText: "Are you more privileged",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more privileged",
    negativeFormulation: "are less privileged",
  },
  {
    questionNumber: 9,
    questionText: "Do you smell better",
    positiveAnswer: "I smell better",
    negativeAnswer: "I smell worse",
    positiveFormulation: "smell better",
    negativeFormulation: "smell worse",
  },
  {
    questionNumber: 10,
    questionText: "Are you a better communicator",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are a better communicator",
    negativeFormulation: "are a worse communicator",
  },
  {
    questionNumber: 11,
    questionText: "Are you better at washing up dishes",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are better at washing up",
    negativeFormulation: "are worse at washing up",
  },
  {
    questionNumber: 12,
    questionText: "Are you more curious",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more curious",
    negativeFormulation: "are less curious",
  },
  {
    questionNumber: 13,
    questionText: "Are you happier",
    positiveAnswer: "I'm happier",
    negativeAnswer: "I'm less happy",
    positiveFormulation: "are happier",
    negativeFormulation: "are less happy",
  },
  {
    questionNumber: 14,
    questionText: "Are you kinder",
    positiveAnswer: "I'm kinder",
    negativeAnswer: "I'm less kind",
    positiveFormulation: "are kinder",
    negativeFormulation: "are less kind",
  },
  {
    questionNumber: 15,
    questionText: "Do you have better ideas",
    positiveAnswer: "they're better",
    negativeAnswer: "they're worse",
    positiveFormulation: "have better ideas",
    negativeFormulation: "have worse ideas",
  },
  {
    questionNumber: 16,
    questionText: "Are you more conservative",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more conservative",
    negativeFormulation: "are less conservative",
  },
  {
    questionNumber: 17,
    questionText: "Do you complain more",
    positiveAnswer: "I complain more",
    negativeAnswer: "I complain less",
    positiveFormulation: "complain more",
    negativeFormulation: "complain less",
  },
  {
    questionNumber: 18,
    questionText: "Do you give more to homeless  people",
    positiveAnswer: "I give more",
    negativeAnswer: "I give less",
    positiveFormulation: "give more to homeless people",
    negativeFormulation: "give less to homeless people",
  },
  {
    questionNumber: 19,
    questionText: "Do you have a better music taste",
    positiveAnswer: "It's better",
    negativeAnswer: "It's worse",
    positiveFormulation: "have a better music taste",
    negativeFormulation: "have a worse music taste",
  },
  {
    questionNumber: 20,
    questionText: "Do you give better gifts",
    positiveAnswer: "they're better",
    negativeAnswer: "they're worse",
    positiveFormulation: "give better gifts",
    negativeFormulation: "give worse gifts",
  },
  {
    questionNumber: 21,
    questionText: "Are you a better friend",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are a better friend",
    negativeFormulation: "are a worse friend",
  },
  {
    questionNumber: 22,
    questionText: "Are you more progressive",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more progressive",
    negativeFormulation: "are less progressive",
  },
  {
    questionNumber: 23,
    questionText: "Are you better looking",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are better looking",
    negativeFormulation: "are worse looking",
  },
  {
    questionNumber: 24,
    questionText: "Are you more interesting",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more interesting",
    negativeFormulation: "are less interesting",
  },
  {
    questionNumber: 25,
    questionText: "Are you better at your work",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are better at their work",
    negativeFormulation: "are worse at their work",
  },
  {
    questionNumber: 26,
    questionText: "Are you more ambitious",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more ambitious",
    negativeFormulation: "are less ambitious",
  },
  {
    questionNumber: 27,
    questionText: "Are you more creative",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more creative",
    negativeFormulation: "are less creative",
  },
  {
    questionNumber: 28,
    questionText: "Are you better at sex",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are better at sex",
    negativeFormulation: "are worse at sex",
  },
  {
    questionNumber: 29,
    questionText: "Are you more patient",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more patient",
    negativeFormulation: "are less patient",
  },
  {
    questionNumber: 30,
    questionText: "Do you have better dental hygiene",
    positiveAnswer: "better",
    negativeAnswer: "worse",
    positiveFormulation: "have better dental hygiene",
    negativeFormulation: "have worse dental hygiene",
  },
  {
    questionNumber: 31,
    questionText: "Do you procrastinate more",
    positiveAnswer: "more",
    negativeAnswer: "less",
    positiveFormulation: "procrastinate more",
    negativeFormulation: "procrastinate less",
  },
  {
    questionNumber: 32,
    questionText: "Are you a better driver",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are a better driver",
    negativeFormulation: "are a worse driver",
  },
  {
    questionNumber: 33,
    questionText: "Did you have a better childhood",
    positiveAnswer: "it was better",
    negativeAnswer: "it was worse",
    positiveFormulation: "had a better childhood",
    negativeFormulation: "had a worse childhood",
  },
  {
    questionNumber: 34,
    questionText: "Are you a better hugger",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are a better hugger",
    negativeFormulation: "are a worse hugger",
  },
  {
    questionNumber: 35,
    questionText: "Are you funnier",
    positiveAnswer: "I'm funnier",
    negativeAnswer: "I'm less funny",
    positiveFormulation: "are funnier",
    negativeFormulation: "are less funny",
  },
  {
    questionNumber: 36,
    questionText: "Are you better at maths",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are better at maths",
    negativeFormulation: "are worse at maths",
  },
  {
    questionNumber: 37,
    questionText: "Do you spend more time on your phone",
    positiveAnswer: "more",
    negativeAnswer: "less",
    positiveFormulation: "spend more time on their phone",
    negativeFormulation: "spend less time on their phone",
  },
  {
    questionNumber: 38,
    questionText: "Are you more narcissistic",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more narcissistic",
    negativeFormulation: "are less narcissistic",
  },
  {
    questionNumber: 39,
    questionText: "Are you more stereotypically your gender",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more stereotypically their gender",
    negativeFormulation: "are less stereotypically their gender",
  },
  {
    questionNumber: 40,
    questionText: "Do you have a better memory",
    positiveAnswer: "it's better",
    negativeAnswer: "it's worse",
    positiveFormulation: "have a better memory",
    negativeFormulation: "have a worse memory",
  },
  {
    questionNumber: 41,
    questionText: "Are you more humble",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more humble",
    negativeFormulation: "are less humble",
  },
  {
    questionNumber: 42,
    questionText: "Are you better at cooking",
    positiveAnswer: "I'm better",
    negativeAnswer: "I'm worse",
    positiveFormulation: "are better at cooking",
    negativeFormulation: "are worse at cooking",
  },
  {
    questionNumber: 43,
    questionText: "Do you change your bed sheets more",
    positiveAnswer: "more",
    negativeAnswer: "less",
    positiveFormulation: "change their bed sheets more",
    negativeFormulation: "change their bed sheets less",
  },
  {
    questionNumber: 44,
    questionText: "Do you have more common sense",
    positiveAnswer: "I have more",
    negativeAnswer: "I have less",
    positiveFormulation: "have more common sense",
    negativeFormulation: "have less common sense",
  },
  {
    questionNumber: 45,
    questionText: "Are more confident ",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more confident",
    negativeFormulation: "are less confident",
  },
  {
    questionNumber: 46,
    questionText: "Do you exercise more",
    positiveAnswer: "more",
    negativeAnswer: "less",
    positiveFormulation: "exercise more",
    negativeFormulation: "exercise less",
  },
  {
    questionNumber: 47,
    questionText: "Do you read more",
    positiveAnswer: "more",
    negativeAnswer: "less",
    positiveFormulation: "read more",
    negativeFormulation: "read less",
  },
  {
    questionNumber: 48,
    questionText: "Do you sleep more",
    positiveAnswer: "more",
    negativeAnswer: "less",
    positiveFormulation: "sleep more",
    negativeFormulation: "sleep less",
  },
  {
    questionNumber: 49,
    questionText: "Do you have more friends ",
    positiveAnswer: "I have more",
    negativeAnswer: "I have less",
    positiveFormulation: "have more friends",
    negativeFormulation: "have fewer friends",
  },
  {
    questionNumber: 50,
    questionText: "Are you healthier",
    positiveAnswer: "I'm healthier",
    negativeAnswer: "I'm less healthy",
    positiveFormulation: "are healthier",
    negativeFormulation: "are less healthy",
  },
  {
    questionNumber: 51,
    questionText: "Are you more religious",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more religious",
    negativeFormulation: "are less religious",
  },
  {
    questionNumber: 52,
    questionText: "Are you more optimistic",
    positiveAnswer: "I'm more",
    negativeAnswer: "I'm less",
    positiveFormulation: "are more optimistic",
    negativeFormulation: "are less optimistic",
  },
];
