import yaml from 'js-yaml';

export async function readYamlFile(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();
  return yaml.load(text);
} 