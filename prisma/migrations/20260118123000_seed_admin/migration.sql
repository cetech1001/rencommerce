-- Seed admin user
INSERT INTO `users` (`id`, `email`, `name`, `password`, `role`, `createdAt`, `updatedAt`)
VALUES (
  'eb45b748-a1d3-4681-923b-ae9f20fdc978',
  'admin@rencommerce.com',
  'Super Admin',
  '$2a$12$seSV2vNTXK.LcToFp9MYEuvnvdR5NyaaoOuPZ0Z5vroeZoV2MCn26',
  'ADMIN',
  NOW(),
  NOW()
);
