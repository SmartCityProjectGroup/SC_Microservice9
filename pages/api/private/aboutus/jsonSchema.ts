import { JSONSchemaType } from 'ajv';

interface AboutUsData {
  date: string
  about_us: string;
  picture: string;
}

interface AboutUsRabbitMQData {
  event_id: number;
  event_name: string;
  service_name: string;
  date: string;
  about_us: string;
  picture: string;
}

export const AboutUsDataSchema: JSONSchemaType<AboutUsData> = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'About Us Landing Page',
  description: 'Data for the About Us Landing Page',
  type: 'object',
  properties: {
    date: {
      type: 'string',
      format: 'date-time'
    },
    about_us: {
      type: 'string',
      minLength: 1,
    },
    picture: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['about_us', 'picture'],
  additionalProperties: false,
};

export const AboutUsRabbitMQSchema: JSONSchemaType<AboutUsRabbitMQData> = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'About Us Landing Page via RabbitMQ',
  description: 'Event data',
  type: 'object',
  properties: {
    event_id: {
      type: 'integer',
      const: 9005,
    },
    event_name: {
      type: 'string',
      const: 'Update About Us',
    },
    service_name: {
      type: 'string',
      const: 'integration',
    },
    date: {
      type: 'string',
      format: 'date-time',
    },
    about_us: {
      type: 'string',
      minLength: 1,
    },
    picture: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['event_id', 'event_name', 'service_name', 'date', 'about_us', 'picture'],
  additionalProperties: false,
};
