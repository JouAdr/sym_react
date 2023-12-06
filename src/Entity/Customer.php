<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Metadata\Delete;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
#[ApiResource(
    paginationEnabled: false,
    order: ['id' => 'DESC'],
    subresourceOperations: [
        'invoices_get_subresource' => ['path' => '/clients/{id}/factures']
    ],
)]
class Customer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['customers_read', 'invoices_read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "le prenom est obligatoire")]
    #[Assert\Length(min: 3, max: 255, minMessage: "le prenom doit faire entre 3 est 255 caractere", maxMessage: "le nom doit faire entre 3 est 255 caractere")]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "le nom est obligatoire")]
    #[Assert\Length(min: 3, max: 255, minMessage: "le prenom doit faire entre 3 est 255 caractere", maxMessage: "le nom doit faire entre 3 est 255 caractere")]
    private ?string $lastname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['customers_read', 'invoices_read'])]
    #[Assert\NotBlank(message: "l'addresse  est obligatoire")]
    private ?string $email = null;

    #[Assert\NotBlank(message: "la  est obligatoire")]
    #[ORM\Column(length: 255)]
    #[Groups(['customers_read', 'invoices_read'])]
    private ?string $company = null;

    #[Groups(['customers_read'])]
    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Invoice::class)]
    private Collection $invoices;

    #[Groups(['customers_read'])]
    #[ORM\ManyToOne(inversedBy: 'customers')]
    #[Assert\NotBlank(message: "l'utilisateur  est obligatoire")]
    private ?User $user = null;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Permet de recuperer le montant total des invoices
     * @return float
     */
    #[Groups(['customers_read', 'invoices_read'])]
    public function getTotalAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * Permet de recuperer  le montant total non payes
     * @return float
     */
    #[Groups(['customers_read', 'invoices_read'])]
    public function getUnpaidAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + ($invoice->getStatus() === "PAID" || $invoice->getStatus() === "CANCELLED" ? 0 : $invoice->getAmount());
        }, 0);
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(string $company): static
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): static
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices->add($invoice);
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): static
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
