<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{

    private $encoder;

    public function __construct(UserPasswordHasherInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($u = 0; $u < 10; $u++) {
            $users = new User();
            $chrono = 1;
            $hash = $this->encoder->hashPassword($users, "root");

            $users->setUsername($faker->userName())
                ->setEmail($faker->email)
                ->setLastname($faker->lastName)
                ->setFirstname($faker->firstName)
                ->setPassword($hash);
            $manager->persist($users);

            for ($c = 0; $c < mt_rand(5, 20); $c++) {
                $customers = new Customer();
                $customers->setFirstname($faker->firstName())
                    ->setEmail($faker->email())
                    ->setCompany($faker->company())
                    ->setUser($users)
                    ->setLastname($faker->lastName());
                $manager->persist($customers);

                for ($i = 0; $i < mt_rand(5, 10); $i++) {
                    $invoices = new Invoice();
                    $status = ['SENT', 'CANCELLED', 'PAID'];
                    $radom_status = array_rand($status, 1);
                    $invoices->setAmount($faker->randomFloat(2, 250, 1000))
                        ->setSentAt($faker->dateTimeBetween('-2 years'))
                        ->setStatus($status[$radom_status])
                        ->setChrono($chrono)
                        ->setCustomer($customers);
                    $chrono++;
                    $manager->persist($invoices);
                }
            }
        }

        $manager->flush();
    }
}
