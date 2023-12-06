<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InvoiceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource(
    order: ['id' => 'DESC'],
    paginationEnabled: false,
    denormalizationContext: ['disable_type_enforcement' => true],
    normalizationContext: ['groups' => ['invoices_read']],
)]
class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['customers_read', 'invoices_read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "le montant de la facture est obligatoire")]
    #[Assert\Type(type: "numeric", message: "le montant de la facture doit etre numerique")]
    private ?float $amount = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "la date de la facture est obligatoire")]
    private ?\DateTimeInterface $sentAt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "le status est obligatoire")]
    #[Assert\Choice(choices: ["SENT", "CANCELLED", "PAID"],  message: "le status de la facture doit etre SENT, PAID, CANCELLED")]
    private ?string $status = null;

    #[ORM\ManyToOne(inversedBy: 'invoices')]
    #[Groups(['invoices_read'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotBlank(message: "le client de la facture doit etre renseigner")]
    private ?Customer $customer = null;

    #[ORM\Column]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "le chrono est obligatoire")]
    #[Assert\Type(type: "numeric", message: "le <chrono></chrono> de la facture doit etre numerique")]
    private ?int $chrono = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): static
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): static
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): static
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): static
    {
        $this->chrono = $chrono;

        return $this;
    }

    /**
     * Permet de recuperer le User appartenant la facture
     * @return float
     */
    #[Groups(['invoices_read'])]
    public function getUser(): User
    {
        return $this->customer->getUser();
    }
}
