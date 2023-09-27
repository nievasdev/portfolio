import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from '@nextui-org/react';
import Link from 'next/link'

const worksjson = require('./works.json');

export default function Works() {

  return (
    <div className="text-center pt-44 sm:pt-8 bg-spacial-2 w-full disaper">
      <p className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-7xl font-sans font-black text-ellipsis z-40 group">
        Works
      </p>
      <div className="grid grid-cols-1 grid-rows-2 xl:grid-cols-2 place-items-center content-center mt-10 h-full">
        {worksjson.map((work) => (
          <div key={work.name} className="p-5 h-full">
            <Card className="h-full max-w-[100%] bg-spacial-2">
              <CardHeader className="gap-3">
                <div className="flex place-items-center w-full">
                  <p className="text-xl">{work.name}</p>
                  <p className="text-small ml-5 text-default-800">{work.time}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="grid place-items-center sm:grid-flow-col">
                <Image alt="Card background" src={work.logo} width={150} />
                <p className="mt-2 sm:ml-5 sm:mt-0">{work.text}</p>
              </CardBody>
              <CardFooter>
                <Link href={"/works/" + work.name} >
                  <Button
                    className="mt-5 w-8 mr-5 sm:mr-28 ml-5"
                    size="sm"
                    variant="flat"
                  >
                    more ...
                  </Button>
                </Link>
                <div className="w-full grid_card">
                  {work.technologies.map((tech) => (
                    <div key={tech.name + '-' + work.name} className="m-2">
                      <Image
                        className="min-w-[50px] pl-2 button-hover"
                        alt="technology"
                        radius="none"
                        src={tech.logo}
                        width={40}
                      />
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
